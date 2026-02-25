---
title: Project Tuning
sidebar_position: 4
description: "Bootstrap options for tuning Digital Alchemy application behavior."
---

Most applications work well with defaults. This page covers bootstrap options that affect startup behavior and performance.

## bootLibrariesFirst

Changes the startup sequence so library `Bootstrap` hooks complete before application services are wired. See [Bootstrapping — bootLibrariesFirst](../02-core-concepts/bootstrapping.md#bootlibrariesfirst).

```typescript
await MY_APP.bootstrap({ bootLibrariesFirst: true });
```

Use this when application services need library resources to be fully available during their own wiring phase (not just in lifecycle callbacks).

## configSources

Disable specific configuration loaders. All are enabled by default:

```typescript
await MY_APP.bootstrap({
  configSources: {
    env:  false,   // Don't load from environment variables
    file: false,   // Don't load from config files
    argv: true,    // Still load from CLI arguments
  },
});
```

Useful in CI/CD environments where you want to provide all config via bootstrap overrides and avoid reading from the environment.

## appendLibrary / appendService

Add libraries or services to the bootstrap without modifying the module definition. Primarily useful in tests (via `TestRunner`), but available at bootstrap too:

```typescript
await MY_APP.bootstrap({
  appendLibrary: [LIB_EXTRA],
  appendService: {
    debug: DebugService,
  },
});
```

## loggerOptions

Control logging behavior at boot:

```typescript
await MY_APP.bootstrap({
  loggerOptions: {
    als: true,          // Enable ALS data in log output
    mergeData: {        // Static fields included in every log line
      env:     process.env.NODE_ENV,
      version: process.env.APP_VERSION,
    },
  },
});
```

## customLogger

Replace the logger implementation used during bootstrap. Primarily for testing (suppressing output), but also useful for custom log sinks:

```typescript
await MY_APP.bootstrap({
  customLogger: pinoInstance, // must implement ILogger
});
```
