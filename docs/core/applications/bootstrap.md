---
title: Bootstrap
id: core-app-bootstrap
sidebar_position: 2
description: ""
---

Once defined, an application module can be bootstrapped with optional configuration overrides:

```ts
await MY_APPLICATION.bootstrap();
```

### Multiple entrypoints

Separating `dev.main.mts` and `prod.main.mts` simplifies local development and production deployments:

- **Local dev (`dev.main.mts`)** can use more development friendly options and verbose logging configurations
- **Production (`prod.main.mts`)** can use more secure settings and provide additional context to logging systems

This split allows each environment to operate with different assumptions while sharing the same application definition.

### Extended example

In this setup, the `utils` module forwards logs to an external logging service like Datadog. Configuration passed into `bootstrap` includes:

- `CLOUD_LOGGER_API_KEY`: Enables the cloud logger at runtime.
- `loggerOptions.mergeData`: Tags each log line with static metadata (like environment, hostname, or service name), making it easier to filter and group logs in a dashboard.

```ts
await MY_APPLICATION.bootstrap({
  configuration: {
    boilerplate: { LOG_LEVEL: "info" },
    utils: {
      CLOUD_LOGGER_API_KEY: process.env.CLOUD_LOGGER_API_KEY,
    },
  },
  loggerOptions: {
    als: true,
    mergeData: {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),
      service: "special-microservice",
    },
  },
});
```


### `bootLibrariesFirst`

In typical usage, `bootstrap()` constructs all libraries and application services first, then runs lifecycle hooks (`onBootstrap`, then `onReady`) for everything in sync. This works well for most full-featured applications.

However, if you’re writing a **script, job runner, or anything lightweight**, it can be cumbersome to wait on external resources manually using lifecycle hooks.

To solve this, you can pass:

```ts
await MY_APPLICATION.bootstrap({ bootLibrariesFirst: true });
```

This changes the startup sequence:

1. **All libraries** are constructed first.
2. The `lifecycle.onBootstrap()` hook is awaited for each library.
3. **Then** application services are constructed.
4. Finally, `lifecycle.onReady()` is called across all modules.

This allows libraries (e.g., a database client, external API client, or telemetry pipeline) to be **fully initialized before your code runs**. That means you can safely start work in your own service logic without waiting or checking readiness.
