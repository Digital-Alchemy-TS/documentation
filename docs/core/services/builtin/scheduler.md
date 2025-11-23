---
title: Scheduler
id: core_scheduler
sidebar_position: 1
description: ""
---

The Digital Alchemy scheduler service is a collection of tools for interacting with timers in a variety of situations.
Scheduler operations are lifecycle-aware to add predictability to unit testing.

Scheduler operations automatically:
- **Start only when the application is fully ready** (after the `Ready` lifecycle event)
- **Stop automatically when the application tears down**
- **Include performance metrics** for monitoring and debugging


## Getting access

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ServiceWithScheduler({ scheduler, logger }: TServiceParams) {
  const CALLBACK = () => logger.info("I ran!");
  scheduler.cron({ ... });
}
```

## Supported syntax

In addition to the traditional numeric milliseconds to represent dureations, `scheduler` methods are also able to to work with other formats:



These are all the same operation

```typescript
// number - milliseconds
scheduler.setTimeout(NOOP, 5000);
// string - ISO 8601 Partial
scheduler.setTimeout(NOOP, "5s");
// array - [qty, unit]
scheduler.setTimeout(NOOP, [5, "second"]);
// object - DurationUnitsObjectType
scheduler.setTimeout(NOOP, { second: 5 });
```

### number - millisecond

```typescript
// number - milliseconds
scheduler.setTimeout(NOOP, 5 * 1000);
```

The `number` / millisecond input input is the traditional javascript approach to providing duration.

> `1000 ms` = `1 second`

### ISO 8601 Partial

```typescript
// string - ISO 8601 Partial
scheduler.setTimeout(NOOP, "5s");
```

The string format allows time to be entered as a HMS format - `[{qty}H][{qty}M][{qty}S]`

Any combination of at least 1 unit is usable.

| Value | Description |
| ----- | ----------- |
| `5h`  | 5 hours |
| `3H2M`| 3 hours 2 minutes |
| `0.5H`| Half hour |
| `0.5s`| 500ms |

Units are case insenstive bt must be provided in order, and numbers may come with decimal points.

### Quantity + Unit

```typescript
// array - [qty, unit]
scheduler.setTimeout(NOOP, [5, "second"]);
```
#### Available Units

| Type | Valid Units |
| ---- | ----------- |
| Week | `week`, `weeks`, `w` |
| Millisecond | `ms`, `millisecond`, `milliseconds` |
| Second | `s`, `second`, `seconds` |
| Minute | `m`, `minute`, `minutes` |
| Hour | `h`, `hour`, `hours` |
| Day | `d`, `D`, `day`, `days` |
| Month | `M`, `month`, `months` |
| Year | `y`, `year`, `years` |

### DurationUnitsObject

```typescript
// object - DurationUnitsObjectType
scheduler.setTimeout(NOOP, { second: 5 });
```

#### Possible Units
- `milliseconds`
- `seconds`
- `minutes`
- `hours`
- `days`
- `months`
- `years`

### Day.js Duration

```typescript
// dayjs duration
scheduler.setTimeout(NOOP, dayjs.duration({ hours: 2, minutes: 30 }));
```

Duration objects can be created as part of library workflows, and are used as an intermediate step in other units.
Other formats are typically more useful to end users.

### Function

```typescript
// function returning -> valid unit
scheduler.setTimeout(NOOP, () => 5000);
```

A sync function returning a valid unit (above) may also be used. This can be used by libraries to easily create logic that decides on the correct duration at the time it's needed.

## Methods

### ⏰ cron

Schedule operations using cron expressions. You can use predefined expressions from the `CronExpression` enum or provide custom expressions.

```typescript
import { CronExpression } from "@digital-alchemy/core";

// ...
scheduler.cron({
  schedule: CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM,
  exec: () => logger.info("running on a cron"),
});

scheduler.cron({
  schedule: "0 1-23/2 * * *",
  exec: () => logger.info("complex schedules"),
});
```

### 🕺 sliding

Sliding schedules use a two-part time calculation system:
1. A function to calculate the next run time
2. A schedule to re-calculate the next run time

This is useful for dynamic scheduling, such as random times within a day.

```typescript
scheduler.sliding({
  reset: CronExpression.MONDAY_TO_FRIDAY_AT_8AM,
  next: () => dayjs().add(Math.floor(Math.random() * 8 * 60), "minute"),
  exec: () => logger.info("random time during the workday"),
});
```

**Note**: The `next` and `exec` functions are validated and must be provided.

### ⏱️ setInterval / setTimeout

These methods work like their Node.js counterparts but with lifecycle awareness. They're most useful for unit tests where timers need automatic cleanup.

```typescript
scheduler.setInterval(() => {
  logger.info("hello world");
}, 1000);

scheduler.setTimeout(() => {
  logger.info("hello world");
}, 1000);
```

## Stopping Schedules

All schedules can be stopped manually using the return value from each method:

```typescript
// const { remove } = scheduler... also works
const remove = scheduler.setTimeout(() => {
  logger.info("delayed operation");
}, 5000);

function onSpecialEvent() {
  // Stop the timer early
  remove();
}
```

Schedules are also automatically stopped when the application tears down.


## 💤 sleep

> **Note**: this is also importable as a standalone function

```typescript
import { sleep } from "@digital-alchemy/core";

// sleep() is same as scheduler.sleep()
```

When awaited, the function will pause for the defined time then return `void`

```typescript
async function DoSomeLogic() {
  // logic
  await sleep({ second: 5 });
  // more logic
}
```

### Cancelling

Sleeps can be cancelled with different possible effects. For basic usage

```typescript
import { SleepReturn } from "@digital-alchemy/core";

// reference accessible between runs
let timer: SleepReturn;

function runAfter5() {
  // if timer currently exists, stop it
  if (timer) {
    timer.kill();
  }

  // create new timer in accessible possition
  timer = sleep({ second: 5 })

  // wait for it to complete
  await timer;

  // this will not happen if something else kills timer
  logger.info("timer completed");
  timer = undefined;
}
```

#### params

```typescript
timer.kill("stop"); // default value
timer.kill("continue");
```

#### Stop vs Continue

Using the `stop` workflow causes the timer to be discarded, letting node clean up from there.

Using the `continue` workflow causes the related timer to immediately complete regardless of time left.

## Performance Metrics

All scheduler operations automatically include performance metrics:
- **Execution timing** for each scheduled operation
- **Context information** for debugging
- **Error tracking** for failed executions

These metrics are available through the framework's metrics system for monitoring and alerting.
