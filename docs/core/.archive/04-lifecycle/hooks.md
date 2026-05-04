---
title: Hooks
sidebar_position: 3
description: "All seven lifecycle hook methods and how to use them."
---

Every service receives `lifecycle` on `TServiceParams`. It exposes seven registration methods — one per stage. All methods accept an optional `priority` number.

```typescript
type TLifeCycleRegister = (callback: () => void | Promise<void>, priority?: number) => void;
```

## onPreInit

```typescript
lifecycle.onPreInit(() => {
  // Runs at PreInit stage — before config is sourced
});
```

## onPostConfig

```typescript
lifecycle.onPostConfig(() => {
  // Config is validated and available
  logger.info({ url: config.my_app.BASE_URL }, "loaded config");
});
```

## onBootstrap

```typescript
lifecycle.onBootstrap(async () => {
  // Main initialization — establish connections, load data
  await db.connect();
});
```

## onReady

```typescript
lifecycle.onReady(() => {
  // Application is fully started
  server.listen(config.my_app.PORT);
});
```

## onPreShutdown

```typescript
lifecycle.onPreShutdown(() => {
  // Stop accepting new work
  server.close();
});
```

## onShutdownStart

```typescript
lifecycle.onShutdownStart(async () => {
  // Flush and close
  await db.end();
  await queue.drain();
});
```

## onShutdownComplete

```typescript
lifecycle.onShutdownComplete(() => {
  // Final cleanup — best effort
  logger.info("shutdown complete");
});
```

## Priority

All hook methods accept an optional second argument: a priority number. This controls the execution order *within* the stage. See [Execution Order](./execution-order.md) for the full rules.

```typescript
// This callback runs before unprioritized ones in the same stage
lifecycle.onBootstrap(connectToDatabase, 100);

// This callback runs after unprioritized ones
lifecycle.onBootstrap(optionalMetrics, -10);
```

## Late registration

If you register a callback for a stage that has **already completed**, the callback is called immediately (except for shutdown stages, which are silently dropped). This handles scenarios where services are added dynamically after boot.
