---
title: Scheduler
---

The `scheduler` option provided by `TServiceParams` provides mechanisms for creating different types of schedules. All scheduler operations are lifecycle-aware and integrate with the framework's performance metrics system.

## Lifecycle Awareness

Scheduler operations automatically:
- **Start only when the application is fully ready** (after the `Ready` lifecycle event)
- **Stop automatically when the application tears down**
- **Include performance metrics** for monitoring and debugging

## Methods

### ⏰ Cron

Schedule operations using cron expressions. You can use predefined expressions from the `CronExpression` enum or provide custom expressions.

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
const stop = scheduler.setTimeout(() => {
  logger.info("delayed operation");
}, 5000);

function onSpecialEvent() {
  // Stop the timer early
  stop();
}
```

Schedules are also automatically stopped when the application tears down.

## Performance Metrics

All scheduler operations automatically include performance metrics:
- **Execution timing** for each scheduled operation
- **Context information** for debugging
- **Error tracking** for failed executions

These metrics are available through the framework's metrics system for monitoring and alerting.
