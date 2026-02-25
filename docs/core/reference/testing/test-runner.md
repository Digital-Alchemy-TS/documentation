---
title: TestRunner
sidebar_position: 1
description: "TestRunner constructor, all fluent builder methods, run vs serviceParams."
---

`TestRunner` is the primary testing API. It boots your application (or library) in an isolated test environment and gives you typed access to all services.

```typescript
import { TestRunner } from "@digital-alchemy/core";
import { MY_APP } from "./application.mts";

const runner = TestRunner(MY_APP);
```

## Constructor

```typescript
function TestRunner<S, C>(options?: CreateTestingLibraryOptions<S, C>): iTestRunner<S, C>
```

`options` can be omitted (creates an empty test app) or can specify a `target` (library or application to test). When passing the application directly: `TestRunner(MY_APP)` is shorthand for `TestRunner({ target: MY_APP })`.

By default:
- Logs are suppressed (noop logger) — use `.emitLogs()` to enable
- Environment variables and config files are not loaded — use `.configure()` to provide config
- Process max listeners is set to unlimited to avoid EventEmitter warnings in test suites

## Fluent builder methods

All methods return `this` for chaining. Multiple calls to methods that accept objects are deep-merged.

### `.configure(config)`

Set config values for this test run. Deep merges with any previous `.configure()` calls.

```typescript
runner.configure({ my_app: { PORT: 9999, DEBUG: true } });
```

### `.setOptions(options)`

Set `TestingBootstrapOptions` directly. Deep merges.

| Option | Default | Description |
|---|---|---|
| `emitLogs` | `false` | Enable log output for this test |
| `loggerOptions` | — | Fine-tune logger output |
| `loadConfigs` | `false` | Load env vars and config files |
| `customLogger` | noop | Custom logger implementation |
| `bootLibrariesFirst` | `false` | Boot libraries before wiring app |
| `configuration` | — | Same as `.configure()` |
| `configSources` | — | Enable/disable specific loaders |

### `.emitLogs(level?)`

Enable log output for this test. Optionally set the log level:

```typescript
runner.emitLogs("debug");
```

Useful when debugging a failing test — add it temporarily to see what's happening.

### `.bootLibrariesFirst()`

Sets `bootLibrariesFirst: true` for this test.

### `.configure(config)`

Config override. Deep merges with previous calls.

### `.appendLibrary(library)`

Add a library that wasn't in the original app's `libraries` array. The added library is available to all services.

```typescript
runner.appendLibrary(MOCK_HTTP_LIB);
```

### `.appendService(service, name?)`

Add an extra service to the app. By default uses `service.name` as the service key; provide `name` to override.

```typescript
runner.appendService(TestHelperService);
runner.appendService(AnonHelper, "helper");
```

### `.replaceLibrary(name, library)`

Swap a library (by name string) for a different implementation. The replacement must have the same name.

```typescript
runner.replaceLibrary("database", MOCK_DATABASE_LIB);
```

### `.setup(serviceFn)`

Register a service function to wire into a `run_first` library that wires before the target module. Multiple calls add multiple services; all run before the main target.

```typescript
runner.setup(async ({ my_app }) => {
  // pre-populate data before the test
  my_app.registry.add("test-item", { id: 1 });
});
```

## Terminal methods

### `.run(testFn)`

Boots the application, runs `testFn` with `TServiceParams`, then tears down. Returns the bootstrapped application.

```typescript
await TestRunner(MY_APP).run(async ({ my_app }) => {
  expect(my_app.counter.value).toBe(0);
  my_app.counter.increment();
  expect(my_app.counter.value).toBe(1);
});
// Teardown happens automatically
```

### `.serviceParams()`

Boots the application and returns `TServiceParams` without tearing down. You must call `.teardown()` manually.

```typescript
const params = await TestRunner(MY_APP).serviceParams();
expect(params.my_app.counter.value).toBe(0);
await params.teardown(); // required
```

Wait — `serviceParams()` returns `TServiceParams`, which does not have a `teardown` property. The teardown comes from the runner:

```typescript
const runner = TestRunner(MY_APP);
const params = await runner.serviceParams();
// use params...
await runner.teardown();
```

### `.teardown()`

Runs the full shutdown sequence. Safe to call if the app is not booted (no-op). Always call this in `afterEach` when using `.serviceParams()`.

## Typical patterns

**Simple test with .run():**

```typescript
it("does the thing", async () => {
  await TestRunner(MY_APP).run(async ({ my_app }) => {
    expect(my_app.service.doThing()).toBe("expected");
  });
});
```

**Manual teardown for shared setup:**

```typescript
describe("MyService", () => {
  let teardown: () => Promise<void>;

  beforeAll(async () => {
    const runner = TestRunner(MY_APP);
    const params = await runner.serviceParams();
    // store params for tests...
    teardown = () => runner.teardown();
  });

  afterAll(() => teardown?.());
});
```

**Chained with mocking:**

```typescript
await TestRunner(MY_APP)
  .replaceLibrary("database", MOCK_DB_LIB)
  .configure({ my_app: { PORT: 9999 } })
  .emitLogs("debug")
  .run(async ({ my_app }) => {
    // ...
  });
```
