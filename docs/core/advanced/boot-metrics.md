---
title: Boot Metrics
sidebar_position: 3
description: "showExtraBootStats and how to read boot timing output."
---

Digital Alchemy tracks the time each service takes to wire and each lifecycle stage takes to complete. You can expose this data for performance investigations via `showExtraBootStats`.

## Enabling boot stats

```typescript
await MY_APP.bootstrap({
  showExtraBootStats: true,
});
```

After the `Ready` stage completes, the framework logs a structured summary with timing for:

- Each module's wiring time (how long all services in that module took to wire)
- Each lifecycle stage duration (how long PreInit, PostConfig, Bootstrap, Ready took)
- Per-service wiring times (if individual service times are above threshold)
- Config loader timing

## What to look for

**Slow service wiring:** If a service function performs async work at the top level (not in a lifecycle callback), it blocks the wiring of subsequent services. If construction time is high, move the async work into `onBootstrap`.

**Slow PostConfig:** The config loader runs at PostConfig. If `PostConfig` is slow, a custom config loader may be making network calls. Cache the result or move the fetch earlier.

**Slow Bootstrap:** Most connection setup happens here. If it's slow, check whether database connection pools are larger than necessary, or whether `warmUp` calls are doing more work than needed.

**Slow Ready:** If your `onReady` callbacks are slow, you may be doing initialization work there that belongs in `onBootstrap`.

## Internal access

The timing data is also accessible programmatically after bootstrap:

```typescript
const params = await MY_APP.bootstrap();

// Service construction times (order of wiring)
params.internal.boot.serviceConstructionTimes.forEach(({ module, service, duration }) => {
  console.log(`${module}:${service} — ${duration}`);
});

// Config loader timings
const configTimings = params.internal.boot.configTimings;
```

This is useful for CI performance gates or dashboards that track startup time trends.
