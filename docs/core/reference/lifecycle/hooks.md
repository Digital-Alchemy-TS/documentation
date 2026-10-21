---
title: Hooks
sidebar_position: 2
description: "Lifecycle hook methods and the configuration guarantees at each startup stage."
---

Every service receives `lifecycle` on `TServiceParams`. It exposes seven registration methods—one per stage. All accept an optional `priority` number.

```typescript
type TLifeCycleRegister = (callback: () => void | Promise<void>, priority?: number) => void;
```

## onPreInit

Runs at `PreInit`, after all services are wired and before configuration initialization. External env/argv/file values and custom loader results have not settled yet.

Legacy defaults are available. An explicit TypeBox root default may be available during construction, and raw bootstrap values can be visible, but schema previews are not guaranteed processed output. Use this stage for early setup and custom loader registration:

```typescript
export function RemoteConfigService({ internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    internal.boilerplate.configuration.registerLoader(
      async () => ({ my_app: { PORT: "8080" } }),
      "remote",
    );
  });
}
```

## onPostConfig

Runs after every enabled loader has settled, native schemas have processed their winning inputs, and one complete configuration snapshot has been published. This is the first stage where final `config.*` values are guaranteed:

```typescript
export function ApiService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    logger.info({ port: config.my_app.PORT }, "config loaded");
  });
}
```

A legacy `required: true` failure throws `REQUIRED_CONFIGURATION_MISSING` before this stage. A schema failure throws a `CONFIG_SCHEMA_*` error before this stage. Nested TypeBox defaults/effects and Zod or opaque Standard Schema defaults are also finalized by this point.

## onBootstrap

Runs at `Bootstrap`, after `PostConfig`. It is safe to open connections, load data, and start background work. It supports async callbacks.

```typescript
lifecycle.onBootstrap(async () => {
  await db.connect();
  await cache.warmUp();
});
```

## onReady

Runs at `Ready`, after all Bootstrap callbacks. It is safe to serve traffic, start cron jobs, and emit an application-ready notification:

```typescript
export function ServerService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onReady(() => {
    server.listen(config.my_app.PORT);
    logger.info({ port: config.my_app.PORT }, "server listening");
  });
}
```

The scheduler activates at `Ready`; jobs registered earlier begin scheduling from this stage onward.

## onPreShutdown

Runs at `PreShutdown` when teardown starts. Stop accepting new work:

```typescript
lifecycle.onPreShutdown(() => {
  server.close();
  queue.pause();
});
```

## onShutdownStart

Runs at `ShutdownStart`. Flush and close resources; async callbacks are supported:

```typescript
lifecycle.onShutdownStart(async () => {
  await db.end();
  await queue.drain();
  await cache.flush();
});
```

## onShutdownComplete

Runs at `ShutdownComplete` for final best-effort cleanup. Errors here are logged without changing the shutdown sequence:

```typescript
lifecycle.onShutdownComplete(() => {
  logger.info("shutdown complete");
});
```

## Priority

All hook methods accept an optional second argument. See [Execution Order](./execution-order.md) for priority semantics.

```typescript
lifecycle.onBootstrap(connectDatabase, 100);
lifecycle.onBootstrap(optionalMetrics, -10);
```

## Late registration

If a startup stage has already completed, a newly registered callback fires immediately. If a shutdown stage has already completed, a newly registered callback is silently dropped.

For the full configuration preview and finalization model, see [Accessing Config](../config/access.md) and [Schema-backed Configuration](../config/schemas.mdx#construction-previews-and-lifecycle).
