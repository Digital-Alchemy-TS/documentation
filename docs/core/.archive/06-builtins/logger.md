---
title: Logger
sidebar_position: 2
description: "The built-in context-aware logger in Digital Alchemy Core."
---

Every service receives a `logger` instance on `TServiceParams`. It is pre-configured with the service's context string (`module_name:service_key`) so every log line is automatically tagged.

## Log levels

In order from most verbose to least: `trace` → `debug` → `info` → `warn` → `error` → `fatal`. Setting `LOG_LEVEL` to a value hides all levels below it. `silent` suppresses all output.

Control the level via config:

```bash
LOG_LEVEL=debug tsx main.mts
```

Or at bootstrap:

```typescript
await MY_APP.bootstrap({
  configuration: { boilerplate: { LOG_LEVEL: "warn" } },
});
```

## Usage

All methods accept either a message string or an object + message:

```typescript
logger.info("application started");
logger.info({ port: 3000 }, "listening on port %s", 3000);
logger.warn({ attempt: retries }, "retrying request");
logger.error({ error }, "request failed");
logger.debug("cache miss for key %s", key);
logger.trace({ payload }, "raw payload received");
```

The object argument is included as structured data in JSON output and displayed inline in pretty format.

## Pretty vs JSON output

By default, the logger emits human-readable output in development:

```
[Mon 09:00:00.000] [INFO][my_app:my_service]: application started
```

In production, switch to JSON for log aggregation pipelines. The format is controlled by the `DigitalAlchemyLogger.setPrettyFormat(false)` API or by the deployment environment.

## Adding log targets

The logger supports multiple output streams. Add targets with `logger.addTarget()` on `DigitalAlchemyLogger` (accessible via `internal.boilerplate.logger`):

```typescript
lifecycle.onBootstrap(() => {
  internal.boilerplate.logger.addTarget((message, data) => {
    datadogLogger.log(message, data);
  });
});
```

## Merging static data into every line

Pass `loggerOptions.mergeData` at bootstrap to include static fields in every log line:

```typescript
await MY_APP.bootstrap({
  loggerOptions: {
    mergeData: {
      service: "payments-api",
      env: process.env.NODE_ENV,
      host: hostname(),
    },
  },
});
```

## ALS integration

With `loggerOptions: { als: true }`, the logger automatically pulls request-scoped data (correlation IDs, request IDs, timing) from AsyncLocalStorage and includes it in every log line emitted within that async context. See [Async Local Storage](../08-advanced/async-local-storage.md).

## Replacing the logger

Declare merge on `ReplacementLogger` to swap the underlying logger implementation (e.g. Pino, Winston):

```typescript
import type { PinoLogger } from "./my-pino-setup.mts";

declare module "@digital-alchemy/core" {
  export interface ReplacementLogger {
    logger: PinoLogger;
  }
}
```

Then call `internal.boilerplate.logger.setBaseLogger(myPinoInstance)` at boot.
