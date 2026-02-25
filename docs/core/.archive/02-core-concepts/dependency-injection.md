---
title: Dependency Injection
sidebar_position: 3
description: "Why Digital Alchemy uses dependency injection and how TServiceParams works."
---

## The problem with global state

In a standard Node.js script, sharing things between modules means either globals or passing arguments everywhere:

```typescript
// ❌ Global state — hard to test, hidden dependencies
let db: Database;
export function getDb() { return db; }

// ❌ Passing everything manually — verbose, inflexible
export function doThing(db: Database, logger: Logger, config: Config) { ... }
```

Both approaches break down as applications grow. Global state makes testing painful (you can't swap the real database for a mock without modifying source files). Passing arguments manually means every function signature grows as requirements change.

## The Digital Alchemy approach

Digital Alchemy gives every service exactly what it needs through a single parameter: `TServiceParams`. The framework builds this object for you at boot time from the module graph — you don't pass it manually, and there are no globals.

```typescript
export function MyService({ logger, config, lifecycle, my_lib }: TServiceParams) {
  // logger   — pre-configured with this service's context
  // config   — typed access to configuration values
  // lifecycle — register callbacks for lifecycle stages
  // my_lib   — the full API of another module, typed
}
```

The key property: **`TServiceParams` is statically typed based on what your application declares.** If `my_lib` is in your `libraries` array and has a `LoadedModules` declaration, TypeScript knows its full shape — including every service it exposes.

## How types flow: `LoadedModules`

The bridge between your module definition and TypeScript's type system is the `LoadedModules` interface. You extend it once per module:

```typescript
export const MY_LIB = CreateLibrary({
  name: "my_lib",
  services: { api: ApiService, cache: CacheService },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_lib: typeof MY_LIB;   // key must match the `name` field
  }
}
```

After this declaration, any service in any application that loads `MY_LIB` gets `my_lib.api` and `my_lib.cache` on `TServiceParams` with full type information:

```typescript
export function ConsumerService({ my_lib }: TServiceParams) {
  // TypeScript knows the return type of ApiService and CacheService
  my_lib.api.get("/endpoint");   // ✅ typed
  my_lib.cache.set("key", val);  // ✅ typed
}
```

## Context strings

Each service is automatically assigned a **context** — a string in the format `module_name:service_name`. This is available as `context` in `TServiceParams` and is automatically attached to log messages:

```typescript
// In an application with name "home_auto", service key "climate"
export function ClimateService({ context, logger }: TServiceParams) {
  logger.info("ready");
  // Prints: [INFO][home_auto:climate]: ready
}
```

Context is also used by downstream libraries (like `synapse`) to attribute logs and errors to specific services.

## What's in TServiceParams

Every service receives all of the following:

| Property | Type | Description |
|---|---|---|
| `als` | `AlsExtension` | AsyncLocalStorage — request-scoped data |
| `config` | typed | All config values, keyed by module name |
| `context` | `TContext` | This service's context string |
| `event` | `EventEmitter` | Application-wide event bus |
| `internal` | `InternalDefinition` | Framework internals and utilities |
| `lifecycle` | `TLifecycleBase` | Register hooks for all lifecycle stages |
| `logger` | `ILogger` | Context-aware logger instance |
| `scheduler` | `DigitalAlchemyScheduler` | Cron, interval, sliding, sleep |
| *(loaded modules)* | typed | Every module with a `LoadedModules` declaration |

Plus any additional services registered from your own modules.

## Testing benefit

Because all dependencies flow through `TServiceParams`, testing is straightforward. The `TestRunner` lets you replace any library with a mock, append extra services, or restrict which services load — all without touching production code. See [Testing](../07-testing/index.md).
