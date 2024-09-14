---
title: 👾 API
sidebar_position: 1
---

The `TestRunner` follows a builder pattern that allows you to test either an application or a library.
It allows you to construct and execute a purpose built wrapper application intended to make it east to test your code.

## 🏗️ Construction

> Options can be called in any order at any time prior to `.run`

#### Basic Setup

```typescript
import { TestRunner } from "@digital-alchemy/core";
// ...etc

describe("A bunch of tests", () => {
  it("does not require params", () => {
    const runner = TestRunner(); // minimum setup
  });

  it("can accept applications", () => {
    const runner = TestRunner({ target: MY_APPLICATION });
  });

  it("can accept libraries", () => {
    const runner = TestRunner({ target: LIB_SPECIAL_SAUCE });
  });
});
```

## ⚙️ Configuration

```typescript
const runner = TestRunner().configure({
  // ...options
});
```

#### Options

| Type | Key | Default | Description |
| --- | --- | --- | --- |
| **Logging** | `emitLogs` | `false` | Set to `true` to allow app to emit logs. |
| **Logging** | `customLogger` | `NOOP` / `default` | Provide alternate logger (`createMockLogger`)
| **Logging** | `loggerOptions` | `{}` | Pass through to `.bootstrap` call |
| **Lifecycle** | `bootLibrariesFirst` | `false` | Set to `true` if testing an application with that requirement |
| **Lifecycle** | `forceTeardown` | `false` | Set to `true` if your app requires running teardown hooks |
| **Configuration** | `configuration` | `{}` | passed through to `.bootstrap` call |
| **Configuration** | `loadConfig` | `false` | Aka do not consider configuration not provided in test / module explicitly |
| **Configuration** | `configLoader` | `undefined` | Invoked during the config loading step to provide data |

> 🗒️ **Logging note:**
>
> Errors that result in application termination (like test failures) are logged directly to `console.error`.
> They always appear in the output.

## 🔄 Module Replacements

The test runner allows for a variety of ways of manipulating the tests in interesting ways.
All of it with the goal of detaching your code from external resources, and making it easier to provide the code coverage you're looking for.

By default, the test runner will take in the same list of library dependencies as the target being tested.

### 📌 Append Library

Add an extra library to this test.

This code is added to the overall mix of libraries at the beginning of bootstrap, and it's execution order depends on it's own dependencies.

```typescript
const runner = TestRunner().appendLibrary(LIB_MOCK_ASSISTANT);
```

### 📍 Append Service

Add an extra service to the target module being tested.

> context will be matched function name if available

```typescript
const runner = TestRunner({ application: THING })
  // service uses `{THING}:SpecialTestingService` for context by default
  .appendService(function SpecialTestingService({ logger, ...etc }) {
  // some logic
});
```
It can also be provided explicitly

```typescript
const runner = TestRunner({ application: THING })
  .appendService(({ logger, ...etc }) => {}, "SpecialTestingService");
```

or default to `uuid`

```typescript
const runner = TestRunner({ application: THING })
  .appendService(({ logger }) => { logger.info("yolo"); });
```

### ♻️ Replace Library

`.replaceLibrary` allows you to substitute a library in the dependency tree for another.

> ⚠️ Compatibility is not enforced, careful with replacements

```typescript
const runner = TestRunner({ application: THING })
  .replaceLibrary("hass", LIB_SPECIAL_HASS_REPLACEMENT);
```

### 🩻 Replace Service

`.replaceService` operates similarly to replacing libraries, but it iss intended to replace a single service in the module being tested instead.

> ⚠️ Compatibility is not enforced, careful with replacements

```typescript
const runner = TestRunner({ application: THING })
  .replaceLibrary("hass", LIB_SPECIAL_HASS_REPLACEMENT);
```

### 👉 Pick Service

Pick a list of services to load from the target module, all others will not load as part of the test.

> - Follow up calls replace list
> - Cannot be combined with `.omitService`

### 🔇 Omit Service

Exclude a list of services from your target module, all others will load

> - Follow up calls replace list
> - Cannot be combined with `.pickService`


## 🧪 Test Lifecycle

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
