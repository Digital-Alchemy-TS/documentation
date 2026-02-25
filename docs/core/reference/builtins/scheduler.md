---
title: Scheduler
sidebar_position: 3
description: "TScheduler: all five methods, cleanup semantics, TOffset format, and activation timing."
---

The `scheduler` on `TServiceParams` provides cron, interval, and timeout scheduling with proper lifecycle integration. All methods return a `RemoveCallback` for manual cleanup.

## Activation timing

The scheduler does **not** fire jobs until the `Ready` lifecycle stage. Jobs registered in `onBootstrap` or earlier are queued until `Ready` fires. This prevents accidental execution of scheduled work during initialization.

## RemoveCallback

All scheduler methods return a `RemoveCallback`. It's a dual-callable: you can call it as a function or use `.remove()`:

```typescript
const stop = scheduler.setInterval(() => doWork(), "30s");
stop();          // cancel
stop.remove();   // also cancel
```

All registered jobs are automatically stopped at `PreShutdown`.

## TOffset

`TOffset` is a flexible duration type accepted by `setInterval`, `setTimeout`, and `sliding`. It can be:

- A `number` in milliseconds: `30_000`, `5 * MINUTE`, `HOUR`
- A human-readable string: `"5s"`, `"30m"`, `"2h"`, `"1d"`
- A dayjs `DurationUnitsObjectType`: `{ minutes: 5, seconds: 30 }`
- An ISO 8601 partial duration string: `"PT5M30S"`
- A `[quantity, unit]` tuple: `[5, "minutes"]`
- A function returning any of the above (for dynamic durations)

```typescript
import { MINUTE, HOUR } from "@digital-alchemy/core";

scheduler.setInterval(() => cleanup(), 30 * MINUTE);  // number
scheduler.setInterval(() => cleanup(), "30m");         // string
scheduler.setInterval(() => cleanup(), [30, "minutes"]); // tuple
scheduler.setInterval(() => cleanup(), { minutes: 30 }); // object
```

To convert a `TOffset` to milliseconds or a `Dayjs` target outside of a scheduler call, use [`internal.utils.getIntervalMs` and `internal.utils.getIntervalTarget`](../services/service-params.mdx#internalutils).

## Methods

### `setInterval(callback, target)`

Like `setInterval`, but lifecycle-aware and crash-safe. If the callback throws, the error is logged and the interval continues.

```typescript
const stop = scheduler.setInterval(() => {
  collectMetrics();
}, "30s");
```

### `setTimeout(callback, target)`

Like `setTimeout`, but lifecycle-aware and crash-safe. The callback fires once after the specified delay.

```typescript
const cancel = scheduler.setTimeout(() => {
  logger.warn("operation timed out");
}, "10s");
```

### `cron(options)`

Run a callback on a cron schedule. Accepts a `schedule` string (cron expression) or an array of schedules.

```typescript
const stop = scheduler.cron({
  schedule: "0 * * * *",  // every hour
  exec: () => hourlyReport(),
});

// Multiple schedules on one handler:
const stop2 = scheduler.cron({
  schedule: ["0 9 * * 1-5", "0 17 * * 1-5"],  // 9am and 5pm weekdays
  exec: () => workdayNotification(),
});
```

### `sliding(options)`

Run a callback at a time determined by a `next()` function, resetting on a `reset` schedule. Useful for scheduling work at irregular intervals that depend on external state.

```typescript
const stop = scheduler.sliding({
  reset: "1m",  // re-evaluate next execution time every minute
  next: () => dayjs(nextEventTime),  // returns the Dayjs for next execution
  exec: () => processNextEvent(),
});
```

`next` is called at registration and then after every `reset` interval. The callback fires when `now()` passes the returned Dayjs value.

### `interval(callback, target)`

Alias for `setInterval`. Identical behavior.

```typescript
const stop = scheduler.interval(() => cleanup(), "5m");
```

## Example: cleanup job

```typescript
export function CacheService({ scheduler, lifecycle, logger }: TServiceParams) {
  let cacheSize = 0;
  const cache = new Map<string, unknown>();

  // setInterval returns RemoveCallback; auto-stopped at PreShutdown
  scheduler.setInterval(() => {
    const before = cache.size;
    // evict stale entries...
    logger.debug({ removed: before - cache.size }, "cache pruned");
  }, "5m");

  return {
    set: (k: string, v: unknown) => { cache.set(k, v); cacheSize = cache.size; },
    get: (k: string) => cache.get(k),
    get size() { return cacheSize; },
  };
}
```
