---
title: Test Lifecycle
sidebar_position: 3
description: "Lifecycle stages in tests, setup functions, and teardown."
---

Tests run the full lifecycle — `PreInit` → `PostConfig` → `Bootstrap` → `Ready` — and then the shutdown sequence on teardown. This means any service using `onBootstrap` or `onReady` will run those callbacks during a test, just like in production.

## Lifecycle is real

```typescript
export function CounterService({ lifecycle }: TServiceParams) {
  let count = 0;

  lifecycle.onBootstrap(() => {
    count = 10;  // runs in tests
  });

  return {
    get value() { return count; },
  };
}
```

```typescript
it("initializes via onBootstrap", async () => {
  await TestRunner(MY_APP).run(async ({ my_app }) => {
    // onBootstrap has already run — count is 10
    expect(my_app.counter.value).toBe(10);
  });
});
```

By the time the test callback in `.run()` receives `TServiceParams`, all lifecycle stages through `Ready` have completed.

## Setup hooks

`.setup(serviceFn)` registers a service that wires into a `run_first` library — a library that loads before the main target. Use it to insert test-specific state before the target module's own `onBootstrap` runs.

```typescript
await TestRunner(MY_APP)
  .setup(async ({ my_lib }: TServiceParams) => {
    // Runs at wiring time for the "run_first" library
    // which wires before MY_APP
    await my_lib.database.seed([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);
  })
  .run(async ({ my_app }) => {
    const users = await my_app.users.list();
    expect(users).toHaveLength(2);
  });
```

Multiple `.setup()` calls are additive — all setup services run.

## Shutdown in tests

`.run()` calls `app.teardown()` when the test callback completes (or throws). All `PreShutdown`, `ShutdownStart`, and `ShutdownComplete` callbacks fire.

This ensures that test-registered cleanup code (closing connections, clearing state) runs correctly. Use it to verify that your cleanup logic works:

```typescript
it("calls onShutdownStart", async () => {
  let shutdownCalled = false;

  await TestRunner(MY_APP)
    .setup(({ lifecycle }: TServiceParams) => {
      lifecycle.onShutdownStart(() => {
        shutdownCalled = true;
      });
    })
    .run(async () => { /* nothing */ });

  expect(shutdownCalled).toBe(true);
});
```

## Testing async lifecycle callbacks

Async `onBootstrap` and `onShutdownStart` callbacks are fully awaited in tests:

```typescript
export function AsyncService({ lifecycle }: TServiceParams) {
  let data: string[] = [];

  lifecycle.onBootstrap(async () => {
    data = await fetchData();
  });

  return {
    get data() { return data; },
  };
}

it("awaits onBootstrap", async () => {
  await TestRunner(MY_APP).run(async ({ my_app }) => {
    // fetchData() has completed — data is populated
    expect(my_app.async.data).not.toHaveLength(0);
  });
});
```

## Isolation

Each `.run()` or `.serviceParams()` call boots a fresh application instance. State from one test does not leak into the next, as long as teardown is called.

For shared state between tests in a single `describe` block, use `.serviceParams()` once in `beforeAll` and call `.teardown()` in `afterAll`:

```typescript
describe("shared state tests", () => {
  let params: TServiceParams;
  const runner = TestRunner(MY_APP);

  beforeAll(async () => {
    params = await runner.serviceParams();
  });

  afterAll(async () => {
    await runner.teardown();
  });

  it("test 1", () => {
    expect(params.my_app.service.value).toBe(0);
  });

  it("test 2", () => {
    params.my_app.service.increment();
    expect(params.my_app.service.value).toBe(1);
  });
});
```

:::caution
Test state persists across `it` blocks in the same `beforeAll` instance. This is intentional when you need it (simulating a sequence of operations) but can cause issues if tests aren't written to be order-independent.
:::
