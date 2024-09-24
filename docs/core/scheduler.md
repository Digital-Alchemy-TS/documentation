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

### ⏳ Interval

> `setInterval`, but goes away on shutdown.

```typescript
scheduler.interval({
  interval: 1000 * 60 * 10, // Every 10 minutes
  exec: () => logger.info("running on an interval"),
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
