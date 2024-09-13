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
    const runner = TestRunner({ application: MY_APPLICATION });
  });

  it("can accept libraries", () => {
    const runner = TestRunner({ libraries: LIB_SPECIAL_SAUCE });
  });
});
```

#### Params

| Name | Description |
| --- | --- |
| `application` | Reference to app created by `CreateApplication` |
| `library` | Reference to library created by `CreateLibrary` |
| `name` | name to use with testing app (**default**: `testing`) |

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

or default to uuid

```typescript
const runner = TestRunner({ application: THING })
  .appendService(({ logger }) => { logger.info("yolo"); });
```


### ♻️ Replace Library
### 🩻 Replace Service

## 🧪 Test Lifecycle

### 🛠️ Setup

### 🚀 Run

### 🧹 Teardown
