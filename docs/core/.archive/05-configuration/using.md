---
title: Using Config in Services
sidebar_position: 5
description: "How to access configuration values in services."
---

Config is available on `TServiceParams` as `config`, a typed proxy keyed by module name.

## When config is safe to read

Config values are available immediately on `TServiceParams`, but **sourced values aren't applied until after `PostConfig`**. Reading config at the top level of your service function (during wiring) returns the definition's default.

```typescript
export function ApiService({ config, lifecycle }: TServiceParams) {
  // ⚠️  During wiring: returns default, not the sourced value
  console.log(config.my_lib.API_URL);

  // ✅ After PostConfig: returns the fully sourced, validated value
  lifecycle.onPostConfig(() => {
    console.log(config.my_lib.API_URL);
  });

  // ✅ onBootstrap and onReady also happen after PostConfig
  lifecycle.onBootstrap(async () => {
    await connectTo(config.my_lib.API_URL);
  });
}
```

## Typed access

Config types flow through automatically via the module's `configuration` definition:

```typescript
config.my_lib.API_URL         // string
config.my_lib.TIMEOUT_MS      // number
config.my_lib.DEBUG_MODE      // boolean
config.my_lib.ALLOWED_ORIGINS // string[]
config.boilerplate.LOG_LEVEL  // "silent" | "trace" | "debug" | "info" | "warn" | "error" | "fatal"
```

## Watching for changes

Config can be updated at runtime (via `config.set()` or the `merge()` method). To react to changes:

```typescript
export function DynamicService({ config, internal }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    internal.boilerplate.configuration.onUpdate((project, property) => {
      if (project === "my_lib" && property === "FEATURE_FLAG") {
        logger.info("FEATURE_FLAG changed to", config.my_lib.FEATURE_FLAG);
      }
    });
  });
}
```

## Testing with config overrides

The `TestRunner` makes it easy to test with specific config values:

```typescript
await TestRunner({ target: MY_APP })
  .configure({ my_lib: { API_URL: "http://test-server" } })
  .run(({ config }) => {
    expect(config.my_lib.API_URL).toBe("http://test-server");
  });
```

See [Testing — Configuration Overrides](../07-testing/test-runner.md#configuration-overrides) for more detail.
