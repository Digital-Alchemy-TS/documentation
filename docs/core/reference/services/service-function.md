---
title: Service Functions
sidebar_position: 1
description: "ServiceFunction signature, wiring semantics, and return behavior."
---

A service function is a plain TypeScript function that receives `TServiceParams` and returns the service's public API. It is the core unit of composition in Digital Alchemy.

## Signature

```typescript
type ServiceFunction<R = unknown> = (params: TServiceParams) => R | Promise<R>;
```

Any function matching this shape can be registered as a service. The return type `R` becomes the service's typed API — what other services see when they access it through `TServiceParams`.

## When it runs

Your service function is called exactly once during wiring — after boilerplate services are ready but before lifecycle stages begin. Any code at the top level of your function runs at that moment:

```typescript
export function MyService({ logger }: TServiceParams) {
  // ← This runs during wiring (top-level code)
  const registry = new Map();
  logger.trace("wiring MyService");

  lifecycle.onReady(() => {
    // ← This runs at Ready stage — after all services wired and config validated
    logger.info("MyService ready");
  });
}
```

**At wiring time:**
- Boilerplate services (`logger`, `config`, `scheduler`, `als`) are available
- Other services in the same module may or may not be wired yet (depends on service order / `priorityInit`)
- Config values from external sources (env, file) are **not yet applied** — only defaults are available

**In lifecycle callbacks:**
- All services are wired
- Config is validated (from `PostConfig` onward)
- Safe to call other services, open connections, start work

## Async service functions

Service functions can be async. The framework awaits the returned Promise before continuing to wire the next service:

```typescript
export async function DatabaseService({ config }: TServiceParams) {
  // async wiring code (unusual — prefer onBootstrap)
  const schema = await loadSchema();

  return {
    query: async (sql: string) => ...,
    schema,
  };
}
```

:::tip
Reserve async wiring for cases where the service's return value genuinely depends on async work. For most connection setup, use `lifecycle.onBootstrap()` — it's explicitly tied to the right lifecycle stage.
:::

## Return types

| Return | Behavior |
|---|---|
| Object | Becomes the service API — `my_app.service.method()` |
| Function | Becomes the service API — `my_app.service(arg)` |
| `void` / no return | Service has no public API; side-effect-only |
| `Promise<T>` | Awaited; resolved value becomes the API |

See [Object Return](./returns-object.md) and [Function Return](./returns-function.md) for detailed patterns.

## Wiring errors

If a service function throws at the top level (during wiring), the error is treated as fatal. The framework logs it and calls `process.exit(1)`. Use `try/catch` inside the function if you need to handle initialization errors gracefully, or move the risky code into a lifecycle callback where errors can be surfaced with better context.
