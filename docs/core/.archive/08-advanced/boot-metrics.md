---
title: Boot Metrics
sidebar_position: 5
description: "Reading service construction times and lifecycle phase timings after bootstrap."
---

After bootstrap completes, `internal.boot` contains timing information for every phase of startup. This is useful for identifying slow services or lifecycle hooks.

## Service construction times

`internal.boot.serviceConstructionTimes` is an array of timing records in construction order:

```typescript
// Available after bootstrap
internal.boot.serviceConstructionTimes.forEach(({ module, service, duration }) => {
  logger.debug({ module, service, duration }, "service construction");
});

// Example output:
// { module: "boilerplate", service: "logger",        duration: "0.12ms" }
// { module: "boilerplate", service: "configuration", duration: "1.45ms" }
// { module: "my_lib",      service: "cache",          duration: "3.21ms" }
// { module: "my_app",      service: "api",            duration: "0.89ms" }
```

## Config loader timings

`internal.boot.configTimings` records how long each config source took to load:

```typescript
logger.debug(internal.boot.configTimings, "config load times");
// { env: "0.5ms", file: "2.1ms", argv: "0.1ms" }
```

## Startup timestamp

```typescript
const bootTime = Date.now() - internal.boot.startup.getTime();
logger.info({ bootTimeMs: bootTime }, "app started");
```

## Completed lifecycle events

```typescript
// Set of stages that have completed — useful for conditional logic
internal.boot.completedLifecycleEvents.has("Ready") // true after full boot
```

## Boot phase

```typescript
internal.boot.phase
// "bootstrap" during wiring
// "running" after onReady completes
// "teardown" during shutdown
```

## Logging metrics at startup

A common pattern is to log boot metrics in an `onReady` callback:

```typescript
export function MetricsService({ internal, logger, lifecycle }: TServiceParams) {
  lifecycle.onReady(() => {
    const slowServices = internal.boot.serviceConstructionTimes
      .filter(({ duration }) => parseFloat(duration) > 100)
      .map(({ module, service, duration }) => `${module}:${service} (${duration})`);

    if (slowServices.length > 0) {
      logger.warn({ slowServices }, "slow service construction detected");
    }
  });
}
```
