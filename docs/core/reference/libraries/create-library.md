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
| `depends` | `LibraryDefinition[]` | — | Hard dependencies — pulled into membership transitively; adds an ordering edge |
| `optionalDepends` | `LibraryDefinition[]` | — | Soft dependencies — ordered first if present; no membership pull; stays untyped |
| `implies` | `(LibraryDefinition \| LibraryGroup)[]` | — | Membership-only bundle — pulled into membership with no ordering edge |
| `priorityInit` | `string[]` | — | Services to wire first within this library |

### `depends`, `implies`, and `optionalDepends`

These three fields all relate to peer libraries, but differ by exactly one bit — whether they add an ordering edge:

| | Membership pull | Ordering edge | Typed on `params` | Missing = error |
|---|:---:|:---:|:---:|:---:|
| `depends` | ✅ (transitive closure) | ✅ | ✅ | ✅ |
| `implies` | ✅ | ❌ | ✅ | — |
| `optionalDepends` | ❌ | ✅ (if present) | ❌ | — |

**`depends`** — Hard dependency. The framework:
1. Pulls this library (and its transitive `depends`) into the wired set (closure-as-membership)
2. Ensures this dependency wires before the current library
3. Throws `MISSING_DEPENDENCY` at boot if the dependency is somehow absent after membership resolution

Use for services your library actively calls at wiring time. The `const` tuple capture means the dependency's types also travel to consumers that import only this library.

**`optionalDepends`** — Soft dependency. The framework:
1. Ensures this dependency wires first *if it's present in membership*
2. Does **not** pull it into membership and does **not** error if it's absent
3. Leaves the dependency untyped on `params`

Use for optional integrations. Your service code must handle the case where the dependency's services are `undefined`.

**`implies`** — Membership-only escape hatch. Prefer `depends` for ordering + membership. Use `implies` only when loading this library should pull in others but this library does not call them at wiring time and therefore does not need them to wire first.

```typescript
export const MY_LIB = CreateLibrary({
  name: "my_lib",
  depends: [DATABASE_LIB],         // ordering + membership + types — always required
  optionalDepends: [CACHE_LIB],    // order if present, no pull, untyped
  services: {
    repo: RepositoryService,
  },
});
```

### `implies` — membership without an ordering edge

`implies` contributes **membership** without adding an ordering edge. When this library is loaded, every library in its `implies` list is pulled into the application's resolved library set and deduped — but no ordering guarantee is added. Use this only when the carrier does not call the implied libraries at wiring time.

```typescript
export const ANALYTICS_FRONT = CreateLibrary({
  name: "analytics_front",
  depends: [SHARED_DB],                       // ordering + membership: wired after SHARED_DB
  implies: [ANALYTICS_STORE, ANALYTICS_API],  // membership only: these travel with me, no ordering
  services: { ... },
});
```

Groups ([`LibraryGroup`](./rollup-libraries)) are accepted in `implies` and are flattened recursively.

:::tip Types of `depends` and `implies` members travel automatically — with named `function` services
`CreateLibrary` captures both `depends` and `implies` as `const` tuples (type parameters on `LibraryDefinition`), so the carrier's emitted `.d.ts` references each dependency and implied member by `typeof import("./member.mjs").Service` — a real module edge. The member's own `LoadedModules` augmentation rides that edge, so a consumer that imports **only** the carrier gets each member's service APIs on `TServiceParams`, both **typed and wired**, with no `LoadedRollups` block and no manual re-export.

This holds **only when the depended-on / implied library's services are literal named `function` declarations**. An arrow / anonymous service is serialized structurally inline with no import edge, so its augmentation never travels — the member still wires, but `params.member` is untyped. For a member that must ship arrow services, fall back to registering the bundle on `LoadedRollups`. See [Library composition](../../guides/library-composition).
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
| `MISSING_DEPENDENCY` | This library's `depends` entry is not reachable in the resolved membership set |
| `MISSING_PRIORITY_SERVICE` | A name in `priorityInit` doesn't exist in `services` |
| `DUPLICATE_LIBRARY` | Two distinct objects share the same library name and neither is app-declared — an unbootable state |

## Duplicate installs

`DUPLICATE_LIBRARY` is governed by a fixed three-case rule. A library is constructed once and held as a global singleton, so exactly one object boots per name:

1. **Declared in the app module** → it is authoritative.
2. **Exactly one instance exists anywhere** → it is used.
3. **Two distinct objects share a name, neither is app-declared** → crash. This is an unbootable, illegal state.

The error states the fact only: `Duplicate library names detected: "<name>" (×N: copy#1 vs copy#2)`. The framework deliberately does not arbitrate between versions — the package manager owns that.
