---
title: Configuration Overrides in Tests
sidebar_position: 4
description: "TestRunner configuration inputs, schema output types, source isolation, and teardown."
---

`TestRunner` accepts the same configuration graph as application bootstrap, but lets a test provide input values and source controls fluently.

```typescript
import { TestRunner } from "@digital-alchemy/core";
import { MY_APP } from "./application.mts";

const runner = TestRunner(MY_APP);
```

## `.configure()` uses schema input

For a schema entry, `.configure()` accepts the provider's input type. Native processing runs during bootstrap, and the test reads the provider output from `config`:

`run()` returns the bootstrapped application; it does not automatically tear it down. Call `await app.teardown()` (or use the runner's `.teardown()` with `.serviceParams()`) after the test.

```typescript
// RETRIES uses a TypeBox codec: input is string, output is number.
await TestRunner(MY_APP)
  .configure({
    my_app: {
      RETRIES: "5",
    },
  })
  .run(async ({ config, lifecycle }) => {
    lifecycle.onPostConfig(() => {
      expect(config.my_app.RETRIES).toBe(5);
    });
  });
```

For legacy entries, `.configure()` keeps the legacy injected type and parsing behavior. Chained configuration calls merge legacy objects deeply. Schema keys are replaced atomically, so a later value replaces the earlier value for that configuration key rather than being deep-merged into the schema input.

`TestRunner(MY_APP)` is shorthand for `TestRunner({ target: MY_APP })`. `.run()` tears down the bootstrapped application only when the test calls or awaits the returned teardown path; always clean up resources in the test lifecycle used by your suite.

## Explicit source isolation

The runner forwards `configSources` to bootstrap. For a deterministic unit test that must not read the host environment, process arguments, or config files, disable every built-in channel explicitly:

```typescript
await TestRunner(MY_APP)
  .setOptions({
    configSources: {
      env: false,
      argv: false,
      file: false,
    },
  })
  .configure({
    my_app: {
      PORT: 9999,
    },
  })
  .run(async ({ config, lifecycle }) => {
    lifecycle.onPostConfig(() => {
      expect(config.my_app.PORT).toBe(9999);
    });
  });
```

This explicit map matters because normal bootstrap defaults `env` and `argv` to enabled while the file loader is opt-in. Do not infer complete source isolation from an omitted option. In the current runner, `configSources` is forwarded directly to bootstrap; do not use the `loadConfigs` option as a substitute for this explicit source map.

To exercise one real source, enable only that channel:

```typescript
const runner = TestRunner(MY_APP).setOptions({
  configSources: {
    env: true,
    argv: false,
    file: false,
  },
});
```

## Schema optionality and defaults

Schema entries do not use the legacy `required` flag:

```typescript
configuration: {
  API_KEY: { schema: Type.String() },
  OPTIONAL_LABEL: { schema: Type.Optional(Type.String()) },
}
```

A missing bare schema value fails with `CONFIG_SCHEMA_INVALID`. An optional schema produces `undefined` unless its native default supplies a value. Legacy `required: true` continues to produce `REQUIRED_CONFIGURATION_MISSING`.

## Bootstrap configuration versus public mutation

The object supplied through `.configure()` is bootstrap input and is processed through the schema. By contrast, `internal.boilerplate.configuration.set()` and `.merge()` are output-shaped APIs. They do not run native decoding or validation again; provide the output type when using them in setup code.

```typescript
await TestRunner(MY_APP)
  .setOptions({
    configSources: { env: false, argv: false, file: false },
  })
  .setup(({ internal }) => {
    internal.boilerplate.configuration.set("my_app", "RETRIES", 7);
  })
  .run(({ config, lifecycle }) => {
    lifecycle.onPostConfig(() => {
      expect(config.my_app.RETRIES).toBe(7);
    });
  });
```

## Required configuration in tests

For a legacy required entry, provide a value through `.configure()`:

```typescript
// Legacy declaration:
API_KEY: { type: "string", required: true }

await TestRunner(MY_APP)
  .setOptions({ configSources: { env: false, argv: false, file: false } })
  .configure({ my_app: { API_KEY: "test-key" } })
  .run(async ({ config, lifecycle }) => {
    lifecycle.onPostConfig(() => {
      expect(config.my_app.API_KEY).toBe("test-key");
    });
  });
```

For a schema declaration, choose a provider-native default or optional schema instead of adding `required` to the outer entry.

## Teardown

`.run()` boots the application and invokes the test callback with typed service parameters. When using `.serviceParams()`, retain the runner and call its `.teardown()` method after assertions:

```typescript
const runner = TestRunner(MY_APP).setOptions({
  configSources: { env: false, argv: false, file: false },
});
const params = await runner.serviceParams();
// use params.config after PostConfig
await runner.teardown();
```

See [TestRunner](./test-runner.md) for the complete builder API and [Schema-backed Configuration](../config/schemas.mdx#input-and-output-types) for provider input/output details.
