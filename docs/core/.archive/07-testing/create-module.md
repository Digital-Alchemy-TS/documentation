---
title: createModule
sidebar_position: 3
description: "Using createModule to build, extend, and transform modules for testing."
---

`createModule` is a builder utility that wraps an existing application or library, letting you modify it before use. It is especially useful in testing scenarios where you need a variation of a module.

## Creating from an existing module

```typescript
import { createModule } from "@digital-alchemy/core";

const base = createModule.fromApplication(MY_APPLICATION);
// or
const base = createModule.fromLibrary(MY_LIB);
```

## Extension API

Call `.extend()` to get a `ModuleExtension` builder. Methods can be chained:

```typescript
const runner = createModule
  .fromApplication(MY_APPLICATION)
  .extend()
  .replaceLibrary(LIB_MOCK_HTTP)     // swap a library
  .appendService(DebugService)        // add an extra service
  .omitService("analytics")           // exclude a service
  .toTest();                          // → TestRunner
```

### appendLibrary(library)

Add a library not in the original module:

```typescript
.appendLibrary(LIB_EXTRA_TOOLS)
```

### appendService(name, service)

Add an extra service to the module:

```typescript
.appendService("debug", function DebugService({ logger }) {
  logger.info("debug service attached");
})
```

### replaceLibrary(library)

Swap a library by name. The replacement must have the same `name` as the one it replaces:

```typescript
.replaceLibrary(LIB_MOCK_HTTP)  // replaces whichever library has name "http"
```

### replaceService(name, service)

Replace a specific service within the module:

```typescript
.replaceService("api", MockApiService)
```

### pickService(...names)

Keep only the listed services; discard all others:

```typescript
.pickService("registry", "cache")
```

### omitService(...names)

Exclude the listed services; keep all others:

```typescript
.omitService("analytics", "telemetry")
```

### rebuild(services)

Replace the entire service map:

```typescript
.rebuild({ api: MockApiService, worker: MockWorkerService })
```

## Exporting the result

After chaining `.extend()` methods, convert to the target type:

```typescript
.toApplication() // → ApplicationDefinition
.toLibrary()     // → LibraryDefinition
.toTest()        // → TestRunner (shorthand for TestRunner({ target: .toApplication() }))
```

## Example: integration test with selective mocking

```typescript
const runner = createModule
  .fromApplication(MY_APP)
  .extend()
  .replaceLibrary(LIB_MOCK_DB)
  .omitService("metrics")
  .toTest()
  .configure({ my_app: { BATCH_SIZE: 10 } });

const app = await runner.run(({ my_app }) => {
  expect(my_app.processor.processedCount).toBe(10);
});
await app.teardown();
```
