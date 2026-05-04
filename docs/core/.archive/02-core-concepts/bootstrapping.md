---
title: Bootstrapping
sidebar_position: 2
description: "How Digital Alchemy boots: the full wiring and lifecycle sequence."
---

## What is bootstrapping?

Bootstrapping is the process that starts when you call `MY_APP.bootstrap()` and ends when your `onReady` callbacks finish. During this window, the framework wires every service, loads configuration, and runs the lifecycle stages in order.

Understanding this sequence tells you **exactly when your code runs** and **why certain things must happen in lifecycle callbacks** rather than at function call time.

## The boot sequence

```mermaid
sequenceDiagram
    participant U as Your Code
    participant B as bootstrap()
    participant W as Wiring
    participant L as Lifecycle

    U->>B: MY_APP.bootstrap()
    B->>W: Wire boilerplate services
    Note over W: logger, config, scheduler, als
    W->>W: LOAD_PROJECT — register config definitions
    W->>W: buildSortOrder(libraries)
    Note over W: Topological sort; throws BAD_SORT on cycles
    loop Each library (dependency order)
        W->>W: Wire library services
    end
    W->>W: Wire application services
    B->>L: exec("PreInit")
    B->>L: exec("PostConfig")
    Note over L: Required config validated here
    B->>L: exec("Bootstrap")
    B->>L: exec("Ready")
    L-->>U: onReady callbacks fire
```

### Phase 1 — Wire boilerplate

Before any user code runs, four boilerplate services are wired in: `logger`, `configuration`, `scheduler`, and `als` (AsyncLocalStorage). These form the foundation of `TServiceParams` — every service gets access to them.

Config definitions from all modules are also collected here (`LOAD_PROJECT`), so the configuration system knows what to expect before it tries to load values.

### Phase 2 — Resolve the dependency graph

Libraries declared in `libraries: [...]` are sorted using `buildSortOrder()`, a topological sort that ensures a library is always wired before any library that depends on it.

**If there is a circular dependency, `buildSortOrder` throws a `BootstrapException` with cause `BAD_SORT` immediately.** There is no runtime proxy or lazy resolution — cycles are a hard error.

If a required dependency is missing from the `libraries` array, the error is `MISSING_DEPENDENCY`.

### Phase 3 — Wire services

Each module (libraries first, then the application) is wired by calling its service functions in order. The service function receives a fully typed `TServiceParams` built from whatever has been wired so far.

:::note When does my service function run?
Your service function is called exactly once — during wiring. Any code at the top level of your function runs at that moment. Code you want to run *after* everything is wired should be placed in a lifecycle callback:

```typescript
export function MyService({ logger }: TServiceParams) {
  // ✅ This runs during wiring — fine for setup that doesn't need other services
  const registry = new Map();

  // ✅ This runs after ALL services are wired and config is validated
  lifecycle.onReady(() => {
    logger.info("everything is ready");
  });
}
```
:::

### Phase 4 — Lifecycle stages

After all services are wired, the lifecycle runs through four stages in sequence:

| Stage | When to use |
|---|---|
| `PreInit` | Early setup that must happen before config is applied |
| `PostConfig` | Config is now validated and available — safe to read `config.*` values |
| `Bootstrap` | Main initialization work; all services and config are available |
| `Ready` | Application is fully started; safe to begin serving traffic, starting jobs, etc. |

See [Lifecycle](../04-lifecycle/index.md) for the full details including shutdown stages and priority ordering.

## Bootstrap options

The `bootstrap()` method accepts an optional options object:

```typescript
await MY_APP.bootstrap({
  // Override config values at boot time (highest priority)
  configuration: {
    boilerplate: { LOG_LEVEL: "debug" },
    my_app: { DATABASE_URL: "postgres://localhost/mydb" },
  },

  // Logger options — merge static data into every log line
  loggerOptions: {
    als: true,
    mergeData: {
      env: process.env.NODE_ENV,
      host: hostname(),
    },
  },

  // Force libraries to fully initialize (Bootstrap stage) before
  // application services are wired — useful for scripts and job runners
  bootLibrariesFirst: true,
});
```

### `bootLibrariesFirst`

By default, all services (library and application) are wired first, then lifecycle stages run for everything together. With `bootLibrariesFirst: true`, the sequence changes:

1. Wire library services → run `Bootstrap` for libraries
2. Wire application services
3. Run `Ready` for everything

This is useful when application services need library resources (e.g. a database connection) to be fully established before their own wiring code runs.

## Multiple entrypoints

It is good practice to keep your module definition separate from the bootstrap call, so different entrypoints can bootstrap with different options:

```typescript title="src/application.mts"
export const MY_APP = CreateApplication({ ... });
```

```typescript title="src/main.mts"           (development)
import { MY_APP } from "./application.mts";
await MY_APP.bootstrap({ configuration: { boilerplate: { LOG_LEVEL: "debug" } } });
```

```typescript title="src/prod.main.mts"       (production)
import { MY_APP } from "./application.mts";
await MY_APP.bootstrap({ configuration: { boilerplate: { LOG_LEVEL: "warn" } } });
```

## Shutdown

Shutdown is the mirror of boot, triggered by `SIGTERM` or `SIGINT` (or by calling `app.teardown()` directly). The shutdown stages are:

`PreShutdown` → `ShutdownStart` → `ShutdownComplete`

Any cleanup work (closing connections, flushing buffers) should be registered with `lifecycle.onPreShutdown()` or `lifecycle.onShutdownStart()`.

## Common boot errors

| Error cause | What it means |
|---|---|
| `BAD_SORT` | Circular dependency between libraries — check `depends` arrays |
| `MISSING_DEPENDENCY` | A library's required dependency is not in the application's `libraries` array |
| `REQUIRED_CONFIGURATION_MISSING` | A config entry marked `required: true` has no value — checked at `PostConfig` |
