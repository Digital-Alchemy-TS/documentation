---
title: 🧪 Test Lifecycle
---

### 🛠️ Setup

Add a service that gets run before the test.

```typescript
const runner = TestRunner({ application: THING })
  .setup(( logger, hass ) => {
    // test setup logic
  });
```

Internally, this service is wired into it's own library with dependencies all other modules.
This forces the `setup` to run after all other libraries have initialized, but before your test runs.

### 🚀 Run

It's time to actually run a test!

`.run` will build a new application using

```typescript
await runner.run(({ hass }) => {
  // your test logic here
  expect(hass).toBeDefined();
});
```

### 🧹 Teardown

By default, tests do not tear themselves down.
For many minimal situations this is fine, other times you may need to gain direct control of when your app stops.

Dealing with the scheduler is one situation where this is required

```typescript
const spy = jest.fn();

// disconnect the clock from reality
jest.useFakeTimers();

// start the app
const app = await runner.run(({ scheduler }) => {
  scheduler.cron({
    exec: spy,
    schedule: CronExpression.EVERY_MINUTE,
  });
});

// fast forward an hour
jest.advanceTimersByTime(60 * 60 * 1000);
expect(spy).toHaveBeenCalledTimes(60);

// return to reality
jest.useRealTimers();

// teardown
await app.teardown();
```
