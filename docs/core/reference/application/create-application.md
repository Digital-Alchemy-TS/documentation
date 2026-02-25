---
title: CreateApplication
sidebar_position: 1
description: "All options for CreateApplication and the ApplicationDefinition API."
---

`CreateApplication` creates the top-level module that owns bootstrap. You call it once per entrypoint. The returned `ApplicationDefinition` has `bootstrap()` and `teardown()` methods.

```typescript
import { CreateApplication } from "@digital-alchemy/core";

export const MY_APP = CreateApplication({
  name: "my_app",
  services: { ... },
  libraries: [...],
  configuration: { ... },
  priorityInit: [...],
});
```

## Options

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `keyof LoadedModules` | ✅ | Module name — must match the key in `LoadedModules` |
| `services` | `ServiceMap` | ✅ | Object mapping service names to service functions |
| `libraries` | `LibraryDefinition[]` | — | Libraries to load before application services |
| `configuration` | `ModuleConfiguration` | — | Config entry declarations for this module |
| `priorityInit` | `string[]` | — | Services to wire first, in listed order |

### `name`

The `name` must exactly match the key you declare in `LoadedModules`:

```typescript
export const MY_APP = CreateApplication({ name: "my_app", ... });

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP; // ← key must match name
  }
}
```

If they don't match, `TServiceParams` won't have a typed entry for your app's services.

### `services`

An object mapping string keys to service functions. Each service function must match the `ServiceFunction` signature — a function that receives `TServiceParams` and returns any value or a Promise.

```typescript
services: {
  auth:     AuthService,
  database: DatabaseService,
  api:      ApiService,
}
```

### `libraries`

An array of `LibraryDefinition` objects (created by `CreateLibrary`). Libraries in this array are wired before application services. The order is determined by the dependency graph, not by array position — but listing them in dependency order is good practice.

```typescript
libraries: [MY_LIB, OTHER_LIB]
```

If a library has `depends: [X]` and `X` is not in this array, bootstrap throws `MISSING_DEPENDENCY`.

### `configuration`

Config entry declarations for this module. See [Configuration Overview](../config/overview.md) for the full type reference.

### `priorityInit`

Names of services to wire first, in the listed order. Useful when a service needs another service's return value at wiring time (not just inside a lifecycle callback).

```typescript
priorityInit: ["database", "cache"]  // database wires first, then cache, then everything else
```

If a name in `priorityInit` doesn't exist in `services`, bootstrap throws `MISSING_PRIORITY_SERVICE`.

## Methods

### `bootstrap(options?)`

Starts the application. Returns a `Promise<TServiceParams>` that resolves when `Ready` completes.

```typescript
await MY_APP.bootstrap({
  configuration: { my_app: { PORT: 8080 } },
});
```

See [Bootstrap Options](./bootstrap.md) for all available options.

Throws `DOUBLE_BOOT` if called on an application that's already running.

### `teardown()`

Runs shutdown stages (`PreShutdown` → `ShutdownStart` → `ShutdownComplete`) and cleans up all resources. Called automatically on `SIGTERM` and `SIGINT`.

```typescript
await MY_APP.teardown();
```

Safe to call if the application is not booted — it's a no-op in that case.

## Type pattern

The standard pattern is to export the application from a definition file and import it in entrypoints and tests:

```typescript title="src/app.mts"
export const MY_APP = CreateApplication({ ... });

declare module "@digital-alchemy/core" {
  export interface LoadedModules { my_app: typeof MY_APP; }
}
```

```typescript title="src/main.mts"
import { MY_APP } from "./app.mts";
await MY_APP.bootstrap();
```

```typescript title="src/main.dev.mts"
import { MY_APP } from "./app.mts";
await MY_APP.bootstrap({ configuration: { boilerplate: { LOG_LEVEL: "debug" } } });
```

This keeps the module definition separate from bootstrap options, making it easy to have multiple entrypoints with different configurations.
