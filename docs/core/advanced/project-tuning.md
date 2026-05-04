---
title: Project Tuning
sidebar_position: 4
description: "LoggerOptions, configSources, customLogger, and handleGlobalErrors for fine-grained bootstrap control."
---

The `BootstrapOptions` object passed to `bootstrap()` has several fields that control logging behavior, configuration source selection, and global error handling. These are rarely needed in basic apps but matter for production deployments, log aggregators, and scripting use cases.

## LoggerOptions

`loggerOptions` fine-tunes the built-in logger without replacing it. All fields are optional.

```typescript
await MY_APP.bootstrap({
  loggerOptions: {
    pretty: true,
    mergeData: { env: "production", service: "my-api" },
    als: true,
    levelOverrides: {
      "my_app:database": "warn",
    },
  },
});
```

### Field reference

| Field | Type | Default | Description |
|---|---|---|---|
| `mergeData` | `object` | — | Data merged into every log line. Use for application tags in log aggregators. |
| `timestampFormat` | `string` | `"ddd HH:mm:ss.SSS"` | dayjs format string for the timestamp prefix. |
| `pretty` | `boolean` | `true` | Pretty-print logs with color and alignment. Set `false` for JSON output in production. |
| `ms` | `boolean` | `false` | Prefix each line with milliseconds elapsed since the previous log. |
| `counter` | `boolean` | `false` | Add an incrementing counter to every log line, starting at 0. |
| `als` | `boolean` | `false` | Extract data from `AsyncLocalStorage` and merge it into every log line. Requires ALS setup — see [Async Local Storage](./async-local-storage.md). |
| `levelOverrides` | `Record<string, TConfigLogLevel>` | — | Override the log level for a specific service or module. Keys are `"module:service"` or `"module"`. |
| `stdOut` | `boolean` | `true` | Emit logs to stdout. Set to `false` if you're using a `customLogger` and don't want double output. |

### Pretty vs JSON

In development, `pretty: true` produces human-readable colored output. In production behind a log aggregator (Datadog, Loki, CloudWatch), you typically want `pretty: false` to get structured JSON:

```typescript
// production
await MY_APP.bootstrap({
  loggerOptions: {
    pretty: false,
    mergeData: {
      env: process.env.ENVIRONMENT,
      version: process.env.APP_VERSION,
    },
  },
});
```

Every log line becomes a JSON object that the aggregator can index.

### levelOverrides

Use `levelOverrides` to suppress noisy services without raising the global log level:

```typescript
loggerOptions: {
  levelOverrides: {
    "my_app": "warn",            // entire module: suppress info/debug
    "my_lib:scheduler": "error", // one service: only errors
    "boilerplate": "silent",     // suppress boilerplate completely
  },
},
```

Keys are `"module"` or `"module:service"`. Values are any `LOG_LEVEL` string: `"silent"`, `"error"`, `"warn"`, `"info"`, `"debug"`, `"trace"`.

## configSources

By default, DA reads configuration from three sources: environment variables (`env`), CLI arguments (`argv`), and a `.env` file (`file`). Use `configSources` to disable specific loaders:

```typescript
await MY_APP.bootstrap({
  configSources: {
    argv: false,  // don't read from CLI arguments
    file: false,  // don't read from .env file
    env: true,    // still read from environment variables (default: true)
  },
});
```

All three keys default to `true` if not specified. Setting a key to `false` removes that source from the merge.

### When to disable sources

**`file: false`** — In containerized deployments where secrets come only from environment variables, disabling file loading prevents accidentally picking up a stray `.env` file.

**`argv: false`** — In scripts or background workers where you don't control the process arguments and don't want arbitrary argv to affect configuration.

**`env: false`** — Rarely useful in production. Primarily for isolated test environments where you want complete determinism from `bootstrap.configuration` alone.

:::note
In tests, `TestRunner` defaults `file: false` automatically. `env` and `argv` are also disabled unless you call `runner.setOptions({ loadConfigs: true })`.
:::

## customLogger

Replace the built-in logger entirely. This is useful when you need custom log transports, a specific log format not supported by `loggerOptions`, or integration with an external logging library.

```typescript
import pino from "pino";

const logger = pino({ level: "info" });

await MY_APP.bootstrap({
  customLogger: (context) => ({
    debug: (data, message) => logger.debug(data, message),
    error: (data, message) => logger.error(data, message),
    fatal: (data, message) => logger.fatal(data, message),
    info: (data, message) => logger.info(data, message),
    trace: (data, message) => logger.trace(data, message),
    warn: (data, message) => logger.warn(data, message),
  }),
});
```

`customLogger` is typed as `GetLogger` — a function that receives a `context` string (`"module:service"`) and returns an object with the six log-level methods.

When `customLogger` is provided, the built-in logger is not created. `loggerOptions` fields that control formatting (`pretty`, `ms`, `counter`, etc.) are ignored — your custom logger is responsible for formatting. `levelOverrides` is still applied before routing calls to the custom logger.

If you're also emitting logs through the built-in path via a wrapper, set `loggerOptions.stdOut: false` to avoid duplicate output.

## handleGlobalErrors

Controls whether DA installs a handler for uncaught exceptions and unhandled promise rejections.

```typescript
await MY_APP.bootstrap({
  handleGlobalErrors: false,  // default: true
});
```

When `true` (the default), DA registers listeners on `process.on("uncaughtException")` and `process.on("unhandledRejection")`. These log the error and trigger the shutdown sequence.

Disable this if:
- Your host environment (Lambda, a test framework, a supervisor process) already handles these signals
- You want full control over crash behavior
- You're running multiple DA applications in the same process (only one should own global error handling)

:::caution
With `handleGlobalErrors: false`, an unhandled rejection will not trigger graceful shutdown. Make sure your host environment handles teardown.
:::

## Combining options

A typical production entrypoint with all three areas configured:

```typescript title="src/main.mts"
await MY_APP.bootstrap({
  loggerOptions: {
    pretty: false,
    mergeData: {
      env: "production",
      service: "my-api",
      version: process.env.APP_VERSION,
    },
    als: true,                         // correlate logs by request ID
    levelOverrides: {
      "boilerplate": "warn",
    },
  },
  configSources: {
    file: false,                       // no .env files in prod
  },
  handleGlobalErrors: true,            // explicit, for documentation clarity
});
```
