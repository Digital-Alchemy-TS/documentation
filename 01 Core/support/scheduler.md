## Description

- #TServiceParams/scheduler

The scheduler is provided as a lifecycle aware method of executing functions on regular intervals. When using the scheduler:

- automatic error trapping
- callbacks only start when hits "ready" state
- automatic termination on application teardown
- optional metrics

## Methods

```typescript
export function Example({ scheduler, logger }: TServiceParams) {
  scheduler.cron({
    exec() {
      logger.info("running on a cron");
    },
    schedule: CronExpression.MONDAY_TO_FRIDAY_AT_09_30AM,
  });
  scheduler.interval({
    exec() {
      logger.info("running on an interval");
    },
    interval: 1000 * 60 * 10,
  });
}
```