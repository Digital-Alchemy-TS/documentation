---
title: Applications
sidebar_position: 2
description: "CreateApplication — defining and bootstrapping a Digital Alchemy application."
---

An application module is the root of every Digital Alchemy program. It owns the service wiring, declares library dependencies, and exposes the `bootstrap()` and `teardown()` methods.

## CreateApplication

```typescript
import { CreateApplication } from "@digital-alchemy/core";

export const MY_APP = CreateApplication({
  name: "my_app",         // Must be unique; becomes the key in TServiceParams and config
  services: {
    hello: HelloService,
    data:  DataService,
  },
  libraries: [LIB_HTTP, LIB_DB],  // Optional; loaded in dependency order
  configuration: {                 // Optional; config values owned by this module
    DATABASE_URL: { type: "string", required: true },
  },
  priorityInit: ["data"],          // Optional; force specific services to wire first
});

// Required for TypeScript to know about this module in TServiceParams
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

## Properties

| Property | Required | Description |
|---|---|---|
| `name` | ✅ | Module name — must match the key in `LoadedModules` |
| `services` | ✅ | Object of service functions to register |
| `libraries` | | Array of library modules to load (in dependency order) |
| `configuration` | | Config definitions owned by this module |
| `priorityInit` | | Service keys that must wire before others in the same module |

## Library versions

If multiple libraries declare the same dependency, the version provided by the **application's** `libraries` array is the one used at runtime. Libraries cannot override each other — the application has final say.

This means if `LIB_A` depends on `LIB_UTILS@1` and `LIB_B` depends on `LIB_UTILS@2`, you must include exactly one version of `LIB_UTILS` in your application's `libraries` array.

## bootstrap()

See [Bootstrapping](../02-core-concepts/bootstrapping.md) for full details on bootstrap options and the boot sequence.

```typescript
await MY_APP.bootstrap();

// With options:
await MY_APP.bootstrap({
  configuration: { my_app: { DATABASE_URL: "postgres://localhost/dev" } },
  bootLibrariesFirst: true,
});
```

## teardown()

Runs the shutdown lifecycle (`PreShutdown` → `ShutdownStart` → `ShutdownComplete`) and cleans up the event emitter. Called automatically on `SIGTERM` and `SIGINT`.

```typescript
await MY_APP.teardown();
```
