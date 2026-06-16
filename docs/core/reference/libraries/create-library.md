---
title: CreateLibrary
sidebar_position: 1
description: "Options for CreateLibrary and the LibraryDefinition type."
---

`CreateLibrary` creates a reusable module that can be consumed by applications or other libraries. Libraries cannot be bootstrapped directly — they must be included in an application's `libraries` array.

```typescript
import { CreateLibrary } from "@digital-alchemy/core";

export const MY_LIB = CreateLibrary({
  name: "my_lib",
  services: { ... },
  configuration: { ... },
  depends: [...],
  optionalDepends: [...],
  implies: [...],
  priorityInit: [...],
});
```

## Options

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `keyof LoadedModules` | ✅ | Library name — must match the key in `LoadedModules` |
| `services` | `ServiceMap` | ✅ | Service functions exposed by this library |
| `configuration` | `ModuleConfiguration` | — | Config entry declarations for this library |
| `depends` | `LibraryDefinition[]` | — | Hard dependencies — must also be in the app's `libraries` array |
| `optionalDepends` | `LibraryDefinition[]` | — | Soft dependencies — wired first if present, no error if absent |
| `implies` | `(LibraryDefinition \| LibraryRollup)[]` | — | Transitive bundle — libraries pulled into *membership* (not ordering) when this one loads |
| `priorityInit` | `string[]` | — | Services to wire first within this library |

### `depends` vs `optionalDepends`

**`depends`** — Hard dependency. The framework will:
1. Ensure this dependency wires before the current library
2. Throw `MISSING_DEPENDENCY` at boot if the application hasn't included it in `libraries`

Use for services your library actively calls. If the dependency is missing, your library can't work.

**`optionalDepends`** — Soft dependency. The framework will:
1. Ensure this dependency wires first *if it's present*
2. Not throw an error if it's absent

Use for optional integrations. Your service code must handle the case where the dependency's services are `undefined`.

```typescript
export const MY_LIB = CreateLibrary({
  name: "my_lib",
  depends: [DATABASE_LIB],         // always required
  optionalDepends: [CACHE_LIB],    // nice to have
  services: {
    repo: RepositoryService,
  },
});
```

### `implies` — transitive membership bundle

`implies` contributes **membership**, not ordering. When this library is loaded, every library in its `implies` list is pulled into the application's resolved library set and deduped — so a consumer can include just this one library and the bundle travels with it.

This is the key distinction from `depends`:

- `depends` / `optionalDepends` are **ordering + validation**. They control *what wires before what*, and `depends` is validated against the app's `libraries` array (`MISSING_DEPENDENCY` if absent). They do **not** add a library to membership.
- `implies` is **membership**. It adds the listed libraries to the app's membership and dedupes them by object identity. It adds no ordering edge — ordering still flows from each member's own `depends`.

```typescript
export const ANALYTICS_FRONT = CreateLibrary({
  name: "analytics_front",
  depends: [SHARED_DB],                       // ordering: wired after SHARED_DB
  implies: [ANALYTICS_STORE, ANALYTICS_API],  // membership: these travel with me
  services: { ... },
});
```

Rollups ([`RollupLibraries`](./rollup-libraries)) are accepted in `implies` and are flattened recursively.

:::tip Types of implied members travel automatically — with named `function` services
`CreateLibrary` captures `implies` as a `const` tuple (a third type parameter on `LibraryDefinition`), so the implier's emitted `.d.ts` references each implied member by `typeof import("./member.mjs").Service` — a real module edge. The member's own `LoadedModules` augmentation rides that edge, so a consumer that imports **only** the implier gets each member's service APIs on `TServiceParams`, both **typed and wired**, with no `LoadedRollups` block and no manual re-export.

This holds **only when the implied library's services are literal named `function` declarations**. An arrow / anonymous service is serialized structurally inline with no import edge, so its augmentation never travels — the member still wires, but `params.member` is untyped. For an implied member that must ship arrow services, fall back to registering the bundle on `LoadedRollups`, like a nameless rollup. See [Library composition](../../guides/library-composition).
:::

### `priorityInit`

Same as in `CreateApplication` — names services within this library that must wire first. Order matters. All named services wire before any unnamed ones.

Throws `MISSING_PRIORITY_SERVICE` if a named service isn't in `services`.

## LoadedModules declaration

Always include a `LoadedModules` augmentation in the library's index file. This is what gives consuming applications typed access to the library's services and config:

```typescript title="src/index.mts"
export const MY_LIB = CreateLibrary({ name: "my_lib", services: { ... } });

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_lib: typeof MY_LIB;
  }
}
```

Any application that imports this file gets the type augmentation for free. No re-declaration needed in the application.

## Validation errors

| Error cause | What it means |
|---|---|
| `MISSING_DEPENDENCY` | This library's `depends` entry is not in the app's `libraries` array |
| `MISSING_PRIORITY_SERVICE` | A name in `priorityInit` doesn't exist in `services` |

## Version mismatch

If an application includes two versions of the same library (e.g., direct dependency and transitive dependency resolve to different versions), the framework emits a warning and uses whichever version the application declared directly. No error is thrown.
