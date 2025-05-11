---
title: Configuration
---

By default the logger will output pretty logs to the console.
The test runner overrides this to `NOOP`, but there are more options under the hood.

## Level Overrides

Override logging on a per-service / module level.

```typescript
MY_APP.bootstrap({
  configuration: {
    boilerplate: {
      LOG_LEVEL: "info"
    }
  },
  loggerOptions: {
    levelOverrides: {
      boilerplate: "silent",
      hass: "silent",
      my_app: {
        evil_logic: "trace"
      }
    }
  }
});
```

In this example, your app will have a default LOG_LEVEL of `info` (unless overridden by an environment file).

- `hass` & `boilerplate` is permanently muted
- `my_app` follows configuration for all services
  - `evil_logic` always emits trace logs

## Merge Data

> Use when you need to add keys to ALL logs, for when multiple applications worth of logs are being sent to central collection.

```typescript
MY_APP.bootstrap({
  loggerOptions: {
    mergeData: {
      service: "Hard Coded Value",
    }
  }
});
```

## Timestamp Format

> default: ddd HH:mm:ss.SSS

## Pretty

Set to false to disable pretty formatting logic

## MS

Emit logs with a "ms since last log" data point

## Counter

Add a `logIdx` constantly incrementing counter to each log

## ALS

Enable logging `AsyncLocalStorage` hooks
