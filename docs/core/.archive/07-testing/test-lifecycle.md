---
title: Test Lifecycle
sidebar_position: 4
description: "Setup, run, and teardown in Digital Alchemy tests; working with fake timers."
---

## Setup

`.setup()` registers a service that runs after all libraries are ready but before the test function. Use it to seed state, configure mocks, or wire up spy functions:

```typescript
const runner = TestRunner({ target: MY_APP })
  .setup(({ my_app }) => {
    my_app.registry.add("test-item", { id: 1, value: "test" });
  });
```

Setup services run in their own library with all other modules as dependencies, ensuring they run after everything else is initialized but before the test callback.

## Run

`.run()` boots the application and calls your test function inside the `onReady` phase. The app remains alive until you call `teardown()`:

```typescript
const app = await runner.run(({ my_app }) => {
  expect(my_app.registry.get("test-item")).toBeDefined();
});
await app.teardown();
```

## Teardown

Tests do not tear down automatically. Call `app.teardown()` explicitly (or `runner.teardown()` after `.serviceParams()`). If you don't, scheduled jobs and event listeners will linger between tests.

In Jest/Vitest, put teardown in `afterEach`:

```typescript
let app: ApplicationDefinition<any, any>;

afterEach(async () => {
  await app?.teardown();
});

it("does the thing", async () => {
  app = await TestRunner({ target: MY_APP }).run(({ my_app }) => {
    expect(my_app.processor.count).toBe(0);
  });
});
```

## Fake timers with the scheduler

The scheduler uses `setInterval`, `setTimeout`, and `CronJob` internally. Jest/Vitest fake timers intercept these, letting you advance time in tests:

```typescript
it("fires scheduled job", async () => {
  const spy = jest.fn();
  jest.useFakeTimers();

  const app = await TestRunner({ target: MY_APP }).run(({ scheduler, context }) => {
    scheduler(context).cron({
      schedule: CronExpression.EVERY_MINUTE,
      exec: spy,
    });
  });

  jest.advanceTimersByTime(60 * 60 * 1000); // advance 1 hour
  expect(spy).toHaveBeenCalledTimes(60);

  jest.useRealTimers();
  await app.teardown();
});
```

:::caution
Always call `jest.useRealTimers()` and `app.teardown()` after tests that use fake timers, or subsequent tests may behave unexpectedly.
:::

## createMockLogger

For tests that verify log output, import `createMockLogger` to get a spy-ready logger:

```typescript
import { createMockLogger } from "@digital-alchemy/core";

const mockLogger = createMockLogger();
// mockLogger.info, .warn, .error, etc. are all no-ops by default
// Replace with jest.fn() to assert on calls:
mockLogger.info = jest.fn();
```
