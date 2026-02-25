---
title: Libraries
sidebar_position: 3
description: "CreateLibrary — building reusable, composable Digital Alchemy modules."
---

A library is a reusable module that can be shared across multiple applications. It looks almost identical to an application, but uses `depends` instead of `libraries` and cannot be bootstrapped directly.

## CreateLibrary

```typescript
import { CreateLibrary } from "@digital-alchemy/core";

export const MY_LIB = CreateLibrary({
  name: "my_lib",
  services: {
    api:   ApiService,
    cache: CacheService,
  },
  depends: [LIB_HTTP],         // Libraries this library requires
  optionalDepends: [LIB_REDIS], // Loaded only if the application also includes them
  configuration: {
    API_BASE_URL: { type: "string", default: "http://localhost:8080" },
    CACHE_TTL:   { type: "number", default: 60 },
  },
  priorityInit: ["cache"],     // Cache wires before api within this library
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_lib: typeof MY_LIB;
  }
}
```

## Properties

| Property | Description |
|---|---|
| `name` | Module name — must match `LoadedModules` key |
| `services` | Service functions to register |
| `depends` | Required library dependencies |
| `optionalDepends` | Dependencies to load only if the consuming application includes them |
| `configuration` | Config definitions owned by this library |
| `priorityInit` | Service keys that wire before others within this library |

## depends vs optionalDepends

`depends` are **required**: if a library declares `depends: [LIB_DB]` and the consuming application does not include `LIB_DB` in its `libraries` array, bootstrap throws `MISSING_DEPENDENCY`.

`optionalDepends` are loaded only if the application includes them. This allows a library to integrate with other libraries when available, without making those integrations mandatory.

## Distributing libraries

Libraries are just npm packages that export a `LibraryDefinition`. Consumers install the package and add it to their application's `libraries` array. The `LoadedModules` declaration travels with the package (typically in its `index.mts`), so TypeScript picks it up automatically on install.
