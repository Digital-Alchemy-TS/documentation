---
title: ServiceRunner
sidebar_position: 2
description: "Lightweight application wrapper for scripts and one-off tasks."
---

`ServiceRunner` is a convenience wrapper for writing lightweight scripts that need Digital Alchemy's config system, logger, and lifecycle but don't warrant a full application module.

It creates a single-service application under the hood, named `"dynamic"` by default.

## Basic usage

```typescript
import { ServiceRunner } from "@digital-alchemy/core";

await ServiceRunner({}, async ({ logger }) => {
  logger.info("script started");
  // ... do work
});
```

## With configuration

```typescript
import { ServiceRunner } from "@digital-alchemy/core";

await ServiceRunner(
  {
    configuration: {
      ENTITY_ID: { type: "string", required: true },
      DRY_RUN:   { type: "boolean", default: false },
    },
  },
  async ({ logger, config }) => {
    if (config.dynamic.DRY_RUN) {
      logger.info("dry run — no changes made");
      return;
    }
    logger.info({ entity: config.dynamic.ENTITY_ID }, "processing entity");
  },
);
```

Pass values via CLI:

```bash
npx tsx src/script.mts --entity_id="switch.example" --dry_run
```

## With libraries

```typescript
import { ServiceRunner } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";

await ServiceRunner(
  {
    libraries: [LIB_HASS],
    bootstrap: { bootLibrariesFirst: true },
  },
  async ({ hass, logger }) => {
    const states = await hass.fetch.getAllEntities();
    logger.info({ count: states.length }, "found entities");
  },
);
```

## Custom name

To get a named config namespace instead of `"dynamic"`:

```typescript
await ServiceRunner(
  { name: "my_script" },
  async ({ config }) => {
    config.my_script.SOME_VALUE; // typed
  },
);
```

## When to use ServiceRunner vs CreateApplication

Use `ServiceRunner` for:
- One-off scripts and migration tasks
- CLI utilities
- Simple jobs that don't need to be tested as a module

Use `CreateApplication` when:
- You need to reuse the module in tests
- You have multiple entrypoints
- The application has significant structure (multiple services, libraries)
