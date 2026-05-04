---
title: Logger
sidebar_position: 2
description: "GetLogger API, log levels, targets, overrides, and custom loggers."
---

The logger is a context-scoped `GetLogger` instance injected into every service. It's pre-bound to the service's context string (`module:service`), so every log line is automatically tagged.

## ILogger methods

Six methods, two call signatures each:

```typescript
logger.trace("message");
logger.trace({ key: "value" }, "message");

logger.debug("message");
logger.debug({ key: "value" }, "message with data");

logger.info("application started");
logger.info({ port: 3000 }, "listening");

logger.warn("something unexpected happened");
logger.warn({ error }, "non-fatal error");

logger.error("operation failed");
logger.error({ error, input }, "failed to process");

logger.fatal("unrecoverable error");
```

## Log levels

Levels in order from most verbose to least:

| Level | When to use |
|---|---|
| `trace` | Framework internals; very noisy |
| `debug` | Diagnostic information, per-operation details |
| `info` | High-level events; normal operation |
| `warn` | Non-critical issues; unexpected but recoverable |
| `error` | Operation failures; external API errors |
| `fatal` | Unrecoverable situations |
| `silent` | Suppress all logs |

Set the minimum level via `boilerplate.LOG_LEVEL` config (default: `"trace"`).

## Log level overrides

Override the log level for specific services or modules via `loggerOptions.levelOverrides` in `BootstrapOptions`:

```typescript
await MY_APP.bootstrap({
  loggerOptions: {
    levelOverrides: {
      "my_app":          "warn",  // module-level: suppress debug/info for whole module
      "my_app:database": "debug", // service-level: verbose for one service
    },
  },
});
```

Keys can be either a module name (`"my_app"`) or a dotted service path (`"my_app:database"`).

## Output format

By default, logs are pretty-printed to stdout with a timestamp prefix:

```
[Mon 09:00:00.000] [INFO][my_app:api]: server started
[Mon 09:00:00.000] [INFO][my_app:api]: { port: 3000 } server started
```

Set `loggerOptions.pretty: false` for JSON output (useful in production log aggregators).

## Adding log targets

Pipe logs to additional destinations using `internal.boilerplate.logger.addTarget()`:

```typescript
export function LoggingService({ internal, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    internal.boilerplate.logger.addTarget((message, data) => {
      // Send to Datadog, Loki, custom sink, etc.
      myLogSink.write({ message, ...data });
    });
  });
}
```

The target receives the formatted message string and the data object.

## Replacing the logger

To use a completely different logger implementation, pass `customLogger` in `BootstrapOptions`:

```typescript
await MY_APP.bootstrap({
  customLogger: myCustomLogger, // must implement GetLogger
});
```

For compile-time type replacement (custom logger methods beyond the default ILogger), use declaration merging on `ReplacementLogger`:

```typescript
declare module "@digital-alchemy/core" {
  export interface ReplacementLogger {
    logger: MyCustomLogger;
  }
}
```

After this, `GetLogger` resolves to `MyCustomLogger` throughout the codebase.

## LoggerOptions

Configure the built-in logger via `loggerOptions` in `BootstrapOptions`:

| Option | Type | Default | Description |
|---|---|---|---|
| `mergeData` | `object` | — | Static data merged into every log line |
| `timestampFormat` | `string` | `"ddd HH:mm:ss.SSS"` | dayjs format string |
| `pretty` | `boolean` | `true` | Pretty format vs JSON |
| `ms` | `boolean` | `false` | Prefix each line with ms since last log |
| `counter` | `boolean` | `false` | Add an incrementing counter per line |
| `als` | `boolean` | `false` | Include ALS context data in every log |
| `levelOverrides` | `Record<string, TConfigLogLevel>` | — | Per-module/service level overrides |
| `stdOut` | `boolean` | `true` | Emit to stdout |
