---
title: ⏰ Scheduler
---

The `scheduler` option provided by `TServiceParams` provides a few mechanisms for creating different schedules.
Operations set up by the `scheduler` are lifecycle aware, meaning that they will:

- only start when the application is fully ready
- automatically stop when you teardown the application

## 🛠 Methods

### ⏰ Cron

> A canned set of expressions are provided in the `CronExpression` enum. You may also provide an expression.

```typescript
scheduler.cron({
  schedule: CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM,
  exec: () => logger.info("running on a cron"),
});

scheduler.cron({
  schedule: "0 1-23/2 * * *",
  exec: () => logger.info("complex schedules"),
});
```

### 🕺 Sliding

Sliding schedules are just as powerful as they are awkward to use.
Their intent is to have a 2 part time calculation system:

1. A function to calculate the next run time
2. A schedule to re-calculate at

This can be used to set up a schedule that resets at midnight, and happens at a random time within the day

```typescript
scheduler.sliding({
  reset: CronExpression.MONDAY_TO_FRIDAY_AT_8AM,
  next: () => dayjs().add(Math.floor(Math.random() * 8 * 60), "minute"),
  exec: () => logger.info("random time during the workday"),
});
```

### ⏳ setInterval / setTimeout

These methods operate the same as their node counterparts, you can simply add `scheduler.` in front of the existing call to take advantage.

> These are most helpful for unit tests, where timers need to be automatically stopped

```typescript
scheduler.setInterval(() => {
  console.log("hello world");
}, 1000);

scheduler.setTimeout(() => {
  console.log("hello world");
}, 1000);
```

## 🛑 Stopping Schedules

All schedules use the same rules for stopping & removal. When the application tears down, schedules will automatically be stopped.
Schedules can additionally be stopped using the return of each method

```typescript
const stop = scheduler.setTimeout(() => {
  // logic
}, 5000);

function onSpecialEvent() {
  // remove the timer
  stop();
}
```
