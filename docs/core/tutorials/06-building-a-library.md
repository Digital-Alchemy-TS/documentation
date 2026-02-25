---
title: Building a Library
sidebar_position: 7
description: "CreateLibrary, depends, optionalDepends, and sharing code between apps."
---

A library is a reusable set of services that can be shared across multiple applications. It's created with `CreateLibrary` instead of `CreateApplication`. The API is almost identical — the main differences are how dependencies are declared and how the framework loads it.

## CreateLibrary vs CreateApplication

| | `CreateApplication` | `CreateLibrary` |
|---|---|---|
| Has `bootstrap()` | ✅ | ❌ |
| Has `configuration` | ✅ | ✅ |
| Has `services` | ✅ | ✅ |
| Has `depends` | ❌ | ✅ |
| Can be in `libraries` array | ❌ | ✅ |

## Writing a library

```typescript title="src/my-lib/index.mts"
import { CreateLibrary } from "@digital-alchemy/core";
import { CacheService } from "./cache.service.mts";
import { HttpService } from "./http.service.mts";

export const MY_LIB = CreateLibrary({
  name: "my_lib",
  configuration: {
    BASE_URL: {
      type: "string",
      required: true,
    },
    CACHE_TTL_MS: {
      type: "number",
      default: 5000,
    },
  },
  services: {
    cache: CacheService,
    http: HttpService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_lib: typeof MY_LIB;
  }
}
```

The `declare module` augmentation lives in the library's own index file. Any application that imports this library gets the type for free.

## Using a library in an application

Add the library to the application's `libraries` array:

```typescript title="src/application.mts"
import { CreateApplication } from "@digital-alchemy/core";
import { MY_LIB } from "./my-lib/index.mts";
import { AppService } from "./app.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  libraries: [MY_LIB],
  services: {
    app: AppService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

The `libraries` array tells the framework which libraries to load and establishes the load order. Libraries are always wired before the application's services.

## Accessing library services

Library services are available on `TServiceParams` under the library's name:

```typescript
export function AppService({ my_lib }: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    const data = await my_lib.http.get("/items");
    // my_lib.cache, my_lib.http — fully typed
  });
}
```

## Library dependencies

If your library depends on another library, declare it in `depends`:

```typescript
export const MY_LIB = CreateLibrary({
  name: "my_lib",
  depends: [OTHER_LIB],   // OTHER_LIB must also be in the app's libraries array
  services: { ... },
});
```

`depends` does two things:
1. Tells the framework to wire `OTHER_LIB` before `MY_LIB`
2. Causes a `MISSING_DEPENDENCY` error at boot if the application hasn't included `OTHER_LIB` in its `libraries` array

Use `optionalDepends` for soft dependencies — the library won't fail if the dependency is absent, but it will be wired first if it is present:

```typescript
export const MY_LIB = CreateLibrary({
  name: "my_lib",
  optionalDepends: [OPTIONAL_LIB],
  services: { ... },
});
```

:::caution Library names must match LoadedModules keys
The `name` in `CreateLibrary` must exactly match the key you use in `LoadedModules`. If `name: "my_lib"` but `LoadedModules` has `myLib`, TypeScript won't connect them — `my_lib` on `TServiceParams` will be `unknown`.
:::

## Configuration scoping

Config is module-scoped. A library's config entries live under `config.my_lib.*`, completely separate from `config.my_app.*`. Applications can't accidentally override a library's config with a same-named key.

Environment variables follow the same pattern: `MY_LIB__BASE_URL=https://api.example.com`.

## Full dependency graph reference

For the topological sort algorithm, cycle detection (`BAD_SORT`), and missing dependency errors, see [Dependency Graph](../reference/libraries/dependency-graph.md).

Next: [Testing Basics →](./07-testing-basics.mdx)
