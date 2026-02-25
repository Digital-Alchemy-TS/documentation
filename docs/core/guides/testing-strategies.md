---
title: Testing Strategies
sidebar_position: 6
description: "Testing philosophy for DA Core — unit vs integration, mocking, lifecycle testing."
---

## Philosophy

Digital Alchemy is designed to be tested through its own API. The `TestRunner` boots your real application (or a modified version of it) in an isolated environment. You test the same code that runs in production, with the same lifecycle, the same config system, and the same service wiring.

The goal is not to mock everything — it's to replace only what you need to replace.

## Unit testing individual service logic

For pure logic that doesn't depend on other services, you don't need TestRunner at all. Extract the logic into regular functions and test them directly:

```typescript
// users.logic.mts — pure logic
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// users.logic.test.mts — no TestRunner needed
it("validates email format", () => {
  expect(validateEmail("user@example.com")).toBe(true);
  expect(validateEmail("not-an-email")).toBe(false);
});
```

Services that have testable business logic benefit from this extraction. The service function handles wiring and lifecycle; pure functions handle computation.

## Integration testing with TestRunner

For testing that involves service interactions, lifecycle callbacks, config, or scheduler behavior — use `TestRunner`:

```typescript
it("creates a user and emits an event", async () => {
  const events: unknown[] = [];

  await TestRunner(MY_APP)
    .appendService(function capture({ event }: TServiceParams) {
      event.on("user:created", e => events.push(e));
    })
    .run(async ({ my_app }) => {
      await my_app.users.create({ name: "Alice", email: "alice@example.com" });
    });

  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ name: "Alice" });
});
```

This test:
- Boots the real application
- Injects a capture service to observe events
- Calls a real service method
- Verifies behavior through the observable side effect

## Mocking with replaceLibrary

When a service depends on a library that makes real network calls or writes to a real database, replace it for tests:

```typescript title="test/mocks/database.mock.mts"
export const MOCK_DB = CreateLibrary({
  name: "database",  // must match real library name
  services: {
    query: MockQueryService,
    connection: MockConnectionService,
  },
});
```

```typescript title="test/orders.test.mts"
it("places an order", async () => {
  await TestRunner(MY_APP)
    .replaceLibrary("database", MOCK_DB)
    .configure({ my_app: { API_KEY: "test" } })
    .run(async ({ my_app, database }) => {
      const order = await my_app.orders.place({ userId: "1", items: ["a"] });
      expect(order.id).toBeDefined();
      expect(database.query.calls).toContain("INSERT INTO orders");
    });
});
```

The application code (`OrdersService`) is completely unmodified — it still calls `database.query(...)`. The mock library intercepts those calls.

## Testing lifecycle callbacks

Lifecycle callbacks run during `TestRunner` boot, just like production. You can verify them directly:

```typescript
it("warms up cache on bootstrap", async () => {
  await TestRunner(MY_APP)
    .replaceLibrary("cache", MOCK_CACHE)
    .run(async ({ cache }) => {
      // onBootstrap in CacheService called cache.warmUp() — verify it ran
      expect(cache.warmUpCalled).toBe(true);
    });
});
```

For testing that shutdown cleanup runs correctly:

```typescript
it("closes connections on teardown", async () => {
  let closeCalled = false;
  const runner = TestRunner(MY_APP);
  await runner.run(async ({ my_app }) => {
    my_app.database.onClose(() => { closeCalled = true; });
  });
  // teardown runs automatically at end of .run()
  expect(closeCalled).toBe(true);
});
```

## Shared state with beforeAll

For tests that simulate a sequence of operations on a running application, use `serviceParams()` with `beforeAll`/`afterAll`:

```typescript
describe("order workflow", () => {
  const runner = TestRunner(MY_APP).replaceLibrary("database", MOCK_DB);
  let params: TServiceParams;

  beforeAll(async () => {
    params = await runner.serviceParams();
  });

  afterAll(() => runner.teardown());

  it("creates user", async () => {
    await params.my_app.users.create({ name: "Alice" });
  });

  it("places order for user", async () => {
    const user = await params.my_app.users.find({ name: "Alice" });
    await params.my_app.orders.place({ userId: user.id, items: ["a"] });
  });

  it("confirms order", async () => {
    const orders = await params.my_app.orders.list();
    expect(orders).toHaveLength(1);
  });
});
```

State persists across `it` blocks because they share the same running application instance. This is intentional — it simulates a real workflow.

## Configuration in tests

Avoid relying on real environment variables in tests. Use `.configure()` to provide deterministic values:

```typescript
runner.configure({
  my_app: {
    DATABASE_URL: "postgres://localhost/test",
    PORT: 9999,
    LOG_LEVEL: "error",
  },
});
```

For integration tests that need real environment values, opt in explicitly:

```typescript
runner.setOptions({ loadConfigs: true });
```

## When to use plain function tests vs TestRunner

| Scenario | Approach |
|---|---|
| Pure business logic (validation, transformation) | Plain function tests |
| Service with lifecycle callbacks | TestRunner |
| Service that calls other services | TestRunner with mocks |
| Full integration with real dependencies | TestRunner, `loadConfigs: true` |
| Testing shutdown cleanup | TestRunner |
| Testing config validation | TestRunner with `.configure()` |
