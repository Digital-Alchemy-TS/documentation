---
title: Configuration Overrides
sidebar_position: 4
description: ".configure(), PartialConfiguration, and environment isolation in tests."
---

## Environment isolation

By default, `TestRunner` does **not** load environment variables or config files. This prevents your local `.env` or system environment from affecting test behavior.

- `loadConfigs: false` (default) — no env vars, no file reads
- Only `default` values from config declarations are applied
- Values you set via `.configure()` are applied on top of defaults

This means tests are deterministic regardless of the environment they run in.

## .configure()

Set config values for the test. Deep merges with any previous `.configure()` calls on the same runner.

```typescript
await TestRunner(MY_APP)
  .configure({
    my_app: {
      DATABASE_URL: "postgres://localhost/test_db",
      PORT: 9999,
      DEBUG: true,
    },
    boilerplate: {
      LOG_LEVEL: "error",
    },
  })
  .run(async ({ config }) => {
    expect(config.my_app.PORT).toBe(9999);
    expect(config.my_app.DEBUG).toBe(true);
  });
```

## PartialConfiguration type

`PartialConfiguration` is a deep partial of the full config shape:

```typescript
type PartialConfiguration = Partial<{
  [ModuleName in keyof ModuleConfigs]: Partial<ConfigTypes<ModuleConfigs[ModuleName]>>;
}>;
```

You only need to provide the keys you care about. Missing keys fall back to their `default` values.

## Chaining .configure() calls

Multiple `.configure()` calls deep merge:

```typescript
const runner = TestRunner(MY_APP)
  .configure({ my_app: { PORT: 9999 } });

// Later, add more config without overwriting PORT
runner.configure({ my_app: { DEBUG: true } });

// Result: { my_app: { PORT: 9999, DEBUG: true } }
```

## Overriding boilerplate config

Common boilerplate overrides for tests:

```typescript
runner
  .configure({
    boilerplate: {
      LOG_LEVEL: "error",   // suppress logs
      IS_TEST: true,        // usually auto-detected, but explicit here
      NODE_ENV: "test",
    },
  })
```

## Required config entries in tests

If your app has `required: true` config entries with no `default`, tests will fail with `REQUIRED_CONFIGURATION_MISSING` unless you provide a value via `.configure()`:

```typescript
// Config declaration:
API_KEY: { type: "string", required: true }  // no default

// In test — must provide a value:
runner.configure({ my_app: { API_KEY: "test-key-123" } });
```

## Loading real config for integration tests

For integration tests that need real environment variables:

```typescript
runner.setOptions({ loadConfigs: true });
```

Or equivalently:

```typescript
runner.setOptions({
  configSources: { env: true, argv: false, file: false },
});
```

Use this sparingly — integration tests with real env vars can be fragile in CI.
