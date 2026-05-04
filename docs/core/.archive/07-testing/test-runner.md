---
title: TestRunner
sidebar_position: 2
description: "The TestRunner builder API for Digital Alchemy."
---

`TestRunner` follows a builder pattern — chain configuration methods before calling `.run()`. All builder methods can be called in any order.

## Construction

```typescript
import { TestRunner } from "@digital-alchemy/core";

TestRunner()                            // bare runner, no target module
TestRunner({ target: MY_APPLICATION })  // test an application
TestRunner({ target: LIB_MY_LIB })      // test a library
TestRunner({ name: "my_test" })         // custom name (default: "testing")
```

## Builder methods

### .configure(configuration)

Override config values for the test. Chained calls deep-merge:

```typescript
TestRunner({ target: MY_APP })
  .configure({ my_app: { API_URL: "http://test-server" } })
  .configure({ boilerplate: { LOG_LEVEL: "debug" } })
```

### .setOptions(options)

Set testing bootstrap options. Chained calls deep-merge:

```typescript
runner.setOptions({
  loadConfigs: false,  // Don't load from env/files (default: false)
  emitLogs: false,     // Suppress logger output (default: false)
})
```

### .emitLogs(level?)

Enable log output for this test — useful when debugging a failing test:

```typescript
runner.emitLogs()           // use default log level
runner.emitLogs("debug")    // enable at a specific level
```

### .bootLibrariesFirst()

Same semantics as the bootstrap option — ensures library `Bootstrap` hooks complete before application services are wired:

```typescript
runner.bootLibrariesFirst()
```

### .setup(serviceFunction)

Add a service that runs *before* the test function, after all other services are ready. Useful for seeding state:

```typescript
runner.setup(({ my_app }) => {
  my_app.registry.add("seed-item", { id: 1, name: "test" });
})
```

Multiple `.setup()` calls chain — all setup services run in order.

## Running

### .run(testFunction)

Boot the application and call `testFunction` with `TServiceParams`. Returns the bootstrapped application (use it to call `teardown()`):

```typescript
const app = await runner.run(({ my_app, config }) => {
  expect(config.my_app.API_URL).toBe("http://test-server");
  expect(my_app.my_service.count).toBe(0);
});
await app.teardown();
```

### .serviceParams()

Instead of running an inline function, get `TServiceParams` directly for more complex test setups:

```typescript
const params = await runner.serviceParams();
// Use params.my_app.my_service, params.config, etc.
await runner.teardown();
```

### .teardown()

Tear down the application after `.serviceParams()`:

```typescript
const params = await runner.serviceParams();
doTests(params);
await runner.teardown();
```

## Configuration overrides

Config passed via `.configure()` takes priority over defaults but behaves the same as bootstrap overrides. Environment variables and config files are **not loaded** by default in tests (`loadConfigs: false`). This ensures tests are isolated from the local environment.

To test with real config sources:

```typescript
runner.setOptions({ loadConfigs: true })
```
