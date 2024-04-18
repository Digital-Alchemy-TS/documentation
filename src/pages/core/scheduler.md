---
title: Core/Scheduler
---

## 📚 Description

The scheduler is provided as a lifecycle aware method of executing functions on regular intervals. When using the scheduler:

- Automatic error trapping
- Callbacks only start when it hits the "ready" state (after [onReady](/core/lifecycle/onReady) completes)
- Automatic termination on application teardown
- Optional metrics on frequency and performance

## 🛠 Methods

### ⏰ Cron

> A canned set of expressions are provided in the `CronExpression` enum. You may also provide an expression.

```typescript
export function Example({ scheduler, logger }: TServiceParams) {
  scheduler.cron({
    exec:() => logger.info("running on a cron"),
    schedule: CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM,
  });

  scheduler.cron({
    exec:() => logger.info("complex schedules"),
    schedule: "0 1-23/2 * * *",
  });
}
```

### ⏳ Interval

> `setInterval`, but goes away on shutdown.

```typescript
export function Example({ scheduler, logger }: TServiceParams) {
  scheduler.interval({
    exec: () => logger.info("running on an interval"),
    interval: 1000 * 60 * 10, // Every 10 minutes
  });
}
```
