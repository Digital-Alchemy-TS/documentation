---
title: Scheduler
sidebar_position: 3
description: "Cron, interval, sliding, and one-shot timers in Digital Alchemy Core."
---

The `scheduler` on `TServiceParams` is a function that accepts a context string and returns a `DigitalAlchemyScheduler`. All scheduled work is automatically cancelled at `ShutdownStart`.

```typescript
export function WorkerService({ scheduler, context }: TServiceParams) {
  const schedule = scheduler(context);
  // Now use schedule.cron / schedule.interval / schedule.sliding / etc.
}
```

All schedule methods return a `RemoveCallback` — call it (or its `.remove()` property) to cancel the schedule before shutdown.

## cron

Schedule work on a cron expression. Accepts a single schedule or an array of schedules:

```typescript
import { CronExpression } from "@digital-alchemy/core";

const stop = schedule.cron({
  schedule: CronExpression.EVERY_MINUTE,
  exec: async () => {
    await processQueue();
  },
});

// Cancel early
stop();
// or: stop.remove()
```

### CronExpression

`CronExpression` is an enum with ~70 presets: `EVERY_SECOND`, `EVERY_5_MINUTES`, `EVERY_HOUR`, `EVERY_DAY_AT_MIDNIGHT`, `EVERY_WEEK`, `MONDAY_TO_FRIDAY_AT_9AM`, and many more. Use it instead of raw cron strings.

```typescript
CronExpression.EVERY_30_MINUTES
CronExpression.EVERY_DAY_AT_NOON
CronExpression.MONDAY_TO_FRIDAY_AT_9AM
```

Raw cron strings also work:

```typescript
schedule.cron({ schedule: "0 */2 * * *", exec: doThing });

// Multiple schedules, same callback
schedule.cron({ schedule: ["0 9 * * 1-5", "0 17 * * 1-5"], exec: doThing });
```

## interval

Repeat on a fixed millisecond interval. Starts at `onReady`:

```typescript
const stop = schedule.interval({
  interval: 5000, // ms
  exec: async () => {
    await checkHealth();
  },
});
```

## sliding

Schedule using a dynamic "next execution time" — recalculated on each trigger. Useful for backing off, rate limiting, or anything where the interval varies:

```typescript
schedule.sliding({
  reset: CronExpression.EVERY_MINUTE,    // How often to recalculate next time
  next: () => {
    const next = getNextProcessingTime(); // Return a Date, Dayjs, timestamp, or undefined
    return next;                         // undefined = skip
  },
  exec: async () => {
    await processNextBatch();
  },
});
```

## setTimeout / setInterval

One-shot and repeating timers that start after `onReady`, automatically cleaned up at shutdown:

```typescript
// Fire once after 10 seconds
schedule.setTimeout(doThing, 10_000);

// Or with duration-style offset
schedule.setTimeout(doThing, "10s");
schedule.setTimeout(doThing, [10, "second"]);

// Repeat every 5 seconds
const stop = schedule.setInterval(doThing, 5_000);
```

## sleep

Awaitable sleep that can be cancelled early. Available both from `scheduler(context).sleep` and as a standalone import:

```typescript
import { sleep } from "@digital-alchemy/core";

await sleep(5000);           // Wait 5 seconds
await sleep("30s");          // Wait 30 seconds
await sleep([1, "minute"]);  // Wait 1 minute

// Cancellable sleep
const timer = sleep(60_000);
setTimeout(() => timer.kill("continue"), 1000); // Wake up early, continue execution
await timer;
```

`timer.kill("stop")` cancels and rejects. `timer.kill("continue")` cancels and resolves.

## TOffset

All time-accepting methods use `TOffset`, which accepts:
- **number** — milliseconds
- **string** — partial ISO 8601 duration: `"5s"`, `"30m"`, `"2h"`, `"1h30m"`
- **tuple** — `[quantity, unit]`: `[5, "second"]`, `[1, "hour"]`
- **Duration** — a Day.js duration object
- **function** — any of the above, wrapped in `() => ...` for dynamic calculation
