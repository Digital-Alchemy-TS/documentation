---
title: Timers
sidebar_position: 2
---

Creating tests that interact with time involve doing some advanced operations with your test runner.

> **Jest Documentation**: [Timer Mocks](https://jestjs.io/docs/timer-mocks)

## Examples

### Cron

This example demonstrates how use the test runner in combination with mock timers through directly using the `scheduler`.

In order to test your own logic using the scheduler, you will have to attach spies differently.

```typescript
// swap to fake timers
jest.useFakeTimers();

const spy = jest.fn();

// boot the test app
const app = await testRunner.run(({ scheduler }) => {

  //
  scheduler.cron({
    exec: spy,
    schedule: CronExpression.EVERY_MINUTE,
  });
});

// AFTER app is booted - time travel by an hour
jest.advanceTimersByTime(60 * 60 * 1000);
expect(spy).toHaveBeenCalledTimes(60);

// swap back to real timers
jest.useRealTimers();

// explicit app teardown (will auto stop schedules)
await app.teardown();
```
