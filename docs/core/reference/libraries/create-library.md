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
