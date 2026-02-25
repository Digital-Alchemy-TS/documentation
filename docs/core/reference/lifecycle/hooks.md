---
title: Hooks
sidebar_position: 2
description: "All seven lifecycle hook methods and how to use them."
---

Every service receives `lifecycle` on `TServiceParams`. It exposes seven registration methods — one per stage. All accept an optional `priority` number.

```typescript
type TLifeCycleRegister = (callback: () => void | Promise<void>, priority?: number) => void;
```

## onPreInit

Runs at `PreInit` — after all services are wired, before configuration is sourced from external sources.

```typescript
lifecycle.onPreInit(() => {
  // Config defaults are available; env/file values are not yet applied
  // Use to: adjust config sources, register custom config loaders
});
```

## onPostConfig

Runs at `PostConfig` — configuration is validated and fully applied. This is the first stage where reading `config.*` values is meaningful.

```typescript
lifecycle.onPostConfig(() => {
  const url = config.my_app.DATABASE_URL;
  logger.info({ url }, "config loaded");
});
```

If a `required: true` config entry has no value, bootstrap halts with `REQUIRED_CONFIGURATION_MISSING` before this stage runs.

## onBootstrap

Runs at `Bootstrap` — main initialization. Safe to open connections, load data, start background work. Supports async.

```typescript
lifecycle.onBootstrap(async () => {
  await db.connect();
  await cache.warmUp();
  logger.info("connections established");
});
```

## onReady

Runs at `Ready` — application is fully started. Safe to start serving traffic, start cron jobs, emit "application ready" notifications.

```typescript
lifecycle.onReady(() => {
  server.listen(config.my_app.PORT);
  logger.info({ port: config.my_app.PORT }, "server listening");
});
```

Note: the `scheduler` service only activates at `Ready` — scheduled jobs registered before this stage fire from `Ready` onward.

## onPreShutdown

Runs at `PreShutdown` — first shutdown signal. Stop accepting new work.

```typescript
lifecycle.onPreShutdown(() => {
  server.close();          // stop accepting new connections
  queue.pause();           // pause intake
});
```

## onShutdownStart

Runs at `ShutdownStart` — flush and close resources. Supports async.

```typescript
lifecycle.onShutdownStart(async () => {
  await db.end();          // close connection pool
  await queue.drain();     // finish pending work
  await cache.flush();     // flush writes
});
```

## onShutdownComplete

Runs at `ShutdownComplete` — final best-effort cleanup. Errors here are logged but don't affect the shutdown sequence.

```typescript
lifecycle.onShutdownComplete(() => {
  logger.info("shutdown complete");
});
```

## Priority

All hook methods accept an optional second argument: a priority number. See [Execution Order](./execution-order.md) for the full priority semantics.

```typescript
// Runs before unprioritized callbacks in the same stage
lifecycle.onBootstrap(connectDatabase, 100);

// Runs after unprioritized callbacks
lifecycle.onBootstrap(optionalMetrics, -10);
```

## Late registration

If you register a callback for a startup stage that has already completed, the callback fires immediately. If you register for a shutdown stage that has already completed, the callback is silently dropped.

## TParentLifecycle.child()

Advanced use: `lifecycle.child()` creates a scoped child lifecycle. The child's callbacks are wired into the parent's stages but can be independently managed. Useful for sub-systems that need to run lifecycle hooks within a larger service.

```typescript
const childLifecycle = lifecycle.child();
childLifecycle.onBootstrap(() => { /* scoped setup */ });
childLifecycle.onShutdownStart(() => { /* scoped teardown */ });
```
