---
title: Module Replacements
sidebar_position: 5
description: "Append, replace, pick, and omit services and libraries in tests."
---

`TestRunner` provides several methods to manipulate which services and libraries load in a test. These let you isolate the code under test from external resources.

## appendLibrary

Add an extra library beyond what the target module declares. The library is included in the overall dependency graph:

```typescript
TestRunner({ target: MY_APP })
  .appendLibrary(LIB_MOCK_ASSISTANT)
```

## appendService

Add an extra service to the target module. Context defaults to the function name or a UUID:

```typescript
// Uses function name "SpyService" as context
TestRunner({ target: MY_APP })
  .appendService(function SpyService({ event }) {
    event.on("my_app:thing", handler);
  });

// Explicit context name
TestRunner({ target: MY_APP })
  .appendService(({ event }) => { ... }, "spy");
```

## replaceLibrary

Swap a library in the dependency tree. The replacement must have the same `name` as the original:

```typescript
TestRunner({ target: MY_APP })
  .replaceLibrary("hass", LIB_MOCK_HASS)
```

:::caution Compatibility is not enforced
The type system won't catch a replacement that doesn't implement the same API. Ensure the mock provides all methods that the code under test calls.
:::

## replaceService

Replace a service within the target module:

```typescript
TestRunner({ target: MY_APP })
  .replaceService("http_client", MockHttpClient)
```

## pickService

Load only the listed services from the target module; all others are excluded:

```typescript
TestRunner({ target: MY_APP })
  .pick("registry", "cache")
// Only RegistryService and CacheService will be wired
```

## omitService

Exclude listed services; all others load normally:

```typescript
TestRunner({ target: MY_APP })
  .omit("analytics", "telemetry")
// All services except AnalyticsService and TelemetryService will wire
```

`pickService` and `omitService` cannot be combined.

## Combining replacements

All replacement methods can be chained. They're applied in declaration order:

```typescript
TestRunner({ target: MY_APP })
  .replaceLibrary("hass", LIB_MOCK_HASS)
  .appendService(SeedService)
  .omit("metrics")
  .configure({ my_app: { BATCH_SIZE: 5 } })
  .emitLogs("debug")
```
