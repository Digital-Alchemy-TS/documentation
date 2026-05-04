---
title: Service Runner
sidebar_position: 5
description: "ServiceRunner for one-off scripts and lightweight automation without a full application."
---

`ServiceRunner` is a convenience wrapper around `CreateApplication` for running a single service function. It's designed for scripts, CLI tools, migration runners, and other short-lived processes where you want access to DA's DI, lifecycle, and config system without the ceremony of declaring a full application module.

## Basic usage

```typescript
import { ServiceRunner } from "@digital-alchemy/core";

await ServiceRunner(
  {
    libraries: [MY_LIB],
    configuration: {
      my_script: {
        TARGET_ID: { type: "string", required: true },
      },
    },
  },
  async ({ logger, config, my_lib }) => {
    const id = config.my_script.TARGET_ID;
    logger.info({ id }, "starting script");
    await my_lib.doWork(id);
    logger.info("done");
  },
);
```

The second argument is a service function that receives `TServiceParams`, including any libraries you declare. The application bootstraps, runs your function, and then tears down.

## Signature

```typescript
async function ServiceRunner<C, NAME extends string = "dynamic">(
  options: ServiceRunnerConfiguration<C, NAME> & { bootstrap?: BootstrapOptions },
  service: (params: LocalServiceParams<C, NAME>) => void | Promise<void>,
): Promise<void>
```

`ServiceRunnerConfiguration` accepts the same options as `CreateApplication` **except** `name`, `services`, and `priorityInit` (which are managed internally). You can optionally set a `name` for the module (defaults to `"dynamic"`), which determines the config namespace:

```typescript
await ServiceRunner(
  {
    name: "migrate",                          // config lives at config.migrate.*
    configuration: {
      migrate: {
        DB_URL: { type: "string", required: true },
      },
    },
    bootstrap: {
      configSources: { file: false },
    },
  },
  async ({ config, logger }) => {
    logger.info({ url: config.migrate.DB_URL }, "running migrations");
    // ...
  },
);
```

## When to use ServiceRunner vs CreateApplication

| Scenario | Use |
|---|---|
| Full application with multiple services, long-running process | `CreateApplication` |
| One-off script, migration, seed, health check | `ServiceRunner` |
| CLI tool that does a single operation and exits | `ServiceRunner` |
| Application with complex inter-service wiring | `CreateApplication` |
| Quick utility that needs libraries and config | `ServiceRunner` |

`ServiceRunner` internally calls `CreateApplication` with a single service named `"service"`. It has the same lifecycle (PreInit → PostConfig → Bootstrap → Ready → shutdown), the same config system, and the same library wiring. The only difference is that you don't declare a module definition file — you just pass the function.

## Libraries and config

`ServiceRunner` supports `libraries`, `configuration`, and a nested `bootstrap` object for `BootstrapOptions`:

```typescript
await ServiceRunner(
  {
    libraries: [DATABASE_LIB, HTTP_LIB],
    configuration: {
      my_script: {
        DRY_RUN: { type: "boolean", default: false },
        BATCH_SIZE: { type: "number", default: 100 },
      },
    },
    bootstrap: {
      loggerOptions: { pretty: true },
      configuration: {
        my_script: { DRY_RUN: true },  // override for this run
      },
    },
  },
  async ({ config, database, http, logger }) => {
    if (config.my_script.DRY_RUN) {
      logger.warn("dry run — no writes");
    }
    // use database and http normally
  },
);
```

## Lifecycle in scripts

Because `ServiceRunner` boots a full DA application, lifecycle hooks work normally. If a library registers `onBootstrap` callbacks (database connections, HTTP clients), those run before your service function executes. Teardown also runs automatically after your function returns.

If you need to do work at a specific lifecycle stage, use `lifecycle` from params:

```typescript
await ServiceRunner({}, async ({ lifecycle, logger }) => {
  lifecycle.onPreShutdown(() => {
    logger.info("cleaning up before shutdown");
  });

  // main work here — runs at Ready
  await doWork();
});
```

:::note
`ServiceRunner` always runs the full lifecycle including teardown. If your script throws, teardown still runs (same as a production application receiving SIGTERM).
:::
