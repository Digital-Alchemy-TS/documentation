---
title: Module Replacements
---
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
