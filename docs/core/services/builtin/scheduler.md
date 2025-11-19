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

export function ServiceWithScheduler({ scheduler }: TServiceParams) {
  // Run schedules in the root of your service
  scheduler.cron({ ... });
}
```

## Supported syntax

In addition to the traditional numeric milliseconds to represent dureations, `scheduler` methods are also able to to work with other formats:

These are all the same operation

```typescript
scheduler.setTimeout(() => { /* some operation */ }, 5000);
scheduler.setTimeout(() => { /* some operation */ }, "5s");
scheduler.setTimeout(() => { /* some operation */ }, [5, "second"]);
scheduler.setTimeout(() => { /* some operation */ }, { second: 5 });
```

#### ISO 8601 Partial

#### Day.js Duration


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
### 💤 sleep

## Stopping Schedules

All schedules can be stopped manually using the return value from each method:

```typescript
const remove = scheduler.setTimeout(() => {
  logger.info("delayed operation");
}, 5000);

function onSpecialEvent() {
  // Stop the timer early
  remove();
}
```

Schedules are also automatically stopped when the application tears down.

## Performance Metrics

All scheduler operations automatically include performance metrics:
- **Execution timing** for each scheduled operation
- **Context information** for debugging
- **Error tracking** for failed executions

These metrics are available through the framework's metrics system for monitoring and alerting.
