---
title: Dependency Injection
sidebar_position: 3
description: "Why DI, how DA's model works, and what LoadedModules actually does."
---

Dependency injection is a way of providing a function its collaborators rather than having the function find or create them itself. This guide explains why it matters, how Digital Alchemy implements it, and what the TypeScript trick with `LoadedModules` is actually doing.

## The problem with global state

The simplest way to share code between files in Node.js is to put it at module scope:

```typescript
// db.mts
export const db = new DatabaseClient();

// users.service.mts
import { db } from "./db.mts";

export async function getUsers() {
  return db.query("SELECT * FROM users");
}
```

This works until you try to test it. The `db` instance is created when the module is first imported. By the time your test runs, `db` is already connected to a real database. To test `getUsers`, you need to either mock Node's module system or spin up a real database.

The alternative — manual prop passing — fixes testability but gets tedious:

```typescript
export async function getUsers(db: DatabaseClient) { ... }
export async function getOrders(db: DatabaseClient, cache: CacheClient) { ... }
```

Every function needs to receive every dependency. Calling `getOrders(db, cache)` requires the caller to have both. As the graph grows, this becomes unmanageable.

## DA's approach

Digital Alchemy's DI model is: each service function receives all its dependencies through a single parameter (`TServiceParams`), which is built by the framework from the dependency graph.

```typescript
export function UserService({ logger, config, my_lib }: TServiceParams) {
  // logger: scoped, pre-created
  // config: validated at boot
  // my_lib: all of MY_LIB's service return values
}
```

The function doesn't know where `logger` comes from. It doesn't import it. It doesn't create it. The framework assembles `TServiceParams` and passes it in.

For testing, you inject a different `TServiceParams`. Replacing `my_lib.database` with a mock is a one-liner in `TestRunner`.

## How TServiceParams is built

During wiring, the framework maintains a `loadedModules` map. As each service function returns its value, that value is set in the map under `module.service`.

When the next service function is called, `TServiceParams` is built by spreading the entire `loadedModules` map:

```typescript
const serviceParams = {
  ...inject,           // all loaded module APIs spread by module name
  als,                 // boilerplate
  config,              // boilerplate
  context,             // "my_app:service_name"
  event,               // boilerplate
  internal,            // boilerplate
  lifecycle,           // boilerplate
  logger,              // boilerplate (scoped to this service)
  scheduler,           // boilerplate (scoped to this service)
  params: undefined,   // set to self after creation
};
```

When `my_lib` is in `inject`, it carries all of `MY_LIB`'s service return values. TypeScript knows this through the `LoadedModules` declaration.

## What LoadedModules actually does

`LoadedModules` is an interface in `@digital-alchemy/core` that starts with only one entry:

```typescript
export interface LoadedModules {
  boilerplate: typeof LIB_BOILERPLATE;
}
```

It's designed for TypeScript interface augmentation. When you write:

```typescript
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

TypeScript merges your declaration into the existing interface. The result is:

```typescript
interface LoadedModules {
  boilerplate: typeof LIB_BOILERPLATE;
  my_app: typeof MY_APP;
}
```

`TServiceParams` is defined as:

```typescript
type TServiceParams = {
  als: ...; lifecycle: ...; logger: ...; /* etc */
} & {
  [K in ExternalLoadedModules]: GetApis<LoadedModules[K]>;
};
```

Where `GetApis<typeof MY_APP>` extracts the return types of all services in `MY_APP`. So `my_app.registry` on `TServiceParams` is typed as `ReturnType<typeof RegistryService>` — inferred automatically from your service function's return type.

**The key insight:** TypeScript infers the entire API surface of `my_app` from the shape of the `CreateApplication` call, through `typeof MY_APP`, through `GetApis<>`. No annotations. No type parameters to maintain. Add a service, the type updates.

## Why this matters for testing

When `TestRunner` calls `replaceLibrary("database", MOCK_DB)`, it swaps the library at the `loadedModules` level. The `TServiceParams` passed to every test service contains `MOCK_DB`'s service APIs instead of the real ones. The service being tested never knows the difference — it just destructures `{ my_lib }` and calls methods.

This is only possible because services don't import their dependencies directly. They receive them as parameters, which means any implementation of the same interface can be substituted.

## Context strings

Every service gets a `context` property: `"module_name:service_name"`. This is a branded string type (`TContext`) used by the logger and for introspection.

The logger you receive is pre-bound to this context:

```typescript
// In my_app:users service:
logger.info("user created");
// → [INFO][my_app:users]: user created
```

The context is set at wiring time and never changes. It identifies exactly where in the dependency graph a log line came from.

`levelOverrides` in `LoggerOptions` accepts these context strings as keys, letting you raise or lower the log level for specific services without modifying their code.
