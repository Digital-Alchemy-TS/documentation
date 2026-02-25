---
title: Module Extension
sidebar_position: 3
description: "createModule and ModuleExtension — the chainable API for composing and extending modules."
---

`createModule` is a builder that wraps an existing application or library definition and provides a chainable API for modifying it before finalizing. It's primarily used for creating test variants, composing shared service sets, or overriding specific services for a particular entrypoint.

## Creating a module

You can start from scratch or wrap an existing application or library:

```typescript
import { createModule } from "@digital-alchemy/core";

// From an existing application
const module = createModule.fromApplication(MY_APP);

// From an existing library
const module = createModule.fromLibrary(MY_LIB);

// From scratch (less common)
const module = createModule({
  name: "my_module",
  services: { ... },
  configuration: { ... },
  depends: [],
  optionalDepends: [],
  priorityInit: [],
});
```

## ModuleExtension — chainable operations

Call `.extend()` on a `DigitalAlchemyModule` to get a `ModuleExtension` builder. All methods return the same builder for chaining. Mutations are applied immediately — all methods throw on invalid operations.

```typescript
const extended = createModule.fromApplication(MY_APP).extend();
```

### `appendLibrary(library)`

Add a library that isn't in the base module's `depends`. Throws if the library is already present (use `replaceLibrary` instead).

```typescript
extended.appendLibrary(EXTRA_LIB);
```

### `appendService(name, fn)`

Add a service not in the base module. Throws if a service with that name already exists.

```typescript
extended.appendService("metrics", MetricsService);
```

### `replaceLibrary(library)`

Swap an existing library for a different implementation. The library's `name` must match an existing dependency. Use for mocking an entire library in tests.

```typescript
extended.replaceLibrary(MOCK_DATABASE_LIB);
```

### `replaceService(name, fn)`

Swap a specific service for a different implementation. The `name` must match an existing service. TypeScript updates the return type to match the new function.

```typescript
extended.replaceService("database", MockDatabaseService);
```

Throws if `name` doesn't exist in services.

### `pickService(...names)`

Keep only the named services, drop everything else. Useful for creating a minimal test module.

```typescript
extended.pickService("auth", "users");
```

Throws if any name doesn't exist.

### `omitService(...names)`

Remove specific services from the module.

```typescript
extended.omitService("metrics", "scheduler");
```

Throws if any name doesn't exist.

### `rebuild(services)`

Replace the entire service map with a new one. Useful when you want to construct the service set from scratch while keeping the module's configuration and dependencies.

```typescript
extended.rebuild({
  api: MockApiService,
  cache: MockCacheService,
});
```

## Terminal methods

Terminal methods finalize the builder and return a usable module.

### `toApplication()`

Returns an `ApplicationDefinition` with all accumulated changes. Can be bootstrapped directly.

```typescript
const testApp = createModule.fromApplication(MY_APP)
  .extend()
  .replaceLibrary(MOCK_DATABASE_LIB)
  .appendService("testHelper", TestHelperService)
  .toApplication();

await testApp.bootstrap();
```

### `toLibrary()`

Returns a `LibraryDefinition` with all accumulated changes.

```typescript
const extendedLib = createModule.fromLibrary(MY_LIB)
  .extend()
  .appendService("extra", ExtraService)
  .toLibrary();
```

### `toTest()`

Returns an `iTestRunner` (a configured `TestRunner` instance) targeting the built application. Shortcut for `TestRunner({ target: extend.toApplication() })`.

```typescript
const runner = createModule.fromApplication(MY_APP)
  .extend()
  .replaceLibrary(MOCK_DATABASE_LIB)
  .toTest();

await runner.run(async ({ my_app }) => {
  // test code
});
```

## Typical patterns

**Create a test variant of an app:**

```typescript
// test-app.mts
export const TEST_APP = createModule.fromApplication(MY_APP)
  .extend()
  .replaceLibrary(MockDatabaseLib)
  .replaceLibrary(MockCacheLib)
  .toApplication();
```

**Create a minimal integration test module:**

```typescript
createModule.fromApplication(MY_APP)
  .extend()
  .pickService("auth", "users")
  .toTest()
  .run(async ({ my_app }) => {
    // only auth and users services are present
  });
```
