---
title: Defining Configuration
sidebar_position: 2
description: "How to declare configuration entries in a Digital Alchemy module."
---

Configuration entries are declared as part of `CreateApplication` or `CreateLibrary`, inside the `configuration` property. Each entry has a `type` and optional metadata.

## Basic example

```typescript
import { CreateLibrary } from "@digital-alchemy/core";

export const MY_LIB = CreateLibrary({
  name: "my_lib",
  configuration: {
    API_URL: {
      type: "string",
      description: "Base URL for the API",
      required: true,         // Boot fails with REQUIRED_CONFIGURATION_MISSING if unset
    },
    TIMEOUT_MS: {
      type: "number",
      description: "Request timeout in milliseconds",
      default: 5000,
    },
    DEBUG_MODE: {
      type: "boolean",
      default: false,
    },
  },
  services: { ... },
});
```

## Common properties

| Property | Description |
|---|---|
| `type` | Required. One of `"string"`, `"number"`, `"boolean"`, `"string[]"`, `"record"` |
| `default` | Value used if no source provides one |
| `required` | If `true`, bootstrap throws `REQUIRED_CONFIGURATION_MISSING` when no value is found |
| `description` | Human-readable description; useful for auto-generated config docs |
| `enum` | (string only) Array of allowed values; TypeScript narrows the type to a union |

## required vs default

A `required: true` entry with no value causes bootstrap to halt at `PostConfig`. A `default` value prevents this by ensuring there is always a value. You can use both — the default is used when no external source provides a value, and `required` is satisfied as long as *any* source (including the default) provides one.

:::tip
Use `required: true` without a `default` for secrets (API keys, database URLs) that must be explicitly provided at runtime. This gives a clear boot failure rather than a confusing runtime error.
:::

## Boilerplate configuration

Every application automatically gets these configuration entries from the boilerplate:

| Key | Type | Default | Source |
|---|---|---|---|
| `boilerplate.LOG_LEVEL` | enum | `"info"` | env, argv |
| `boilerplate.NODE_ENV` | string | `process.env.NODE_ENV \|\| "local"` | env |
| `boilerplate.IS_TEST` | boolean | auto-detected | env |
| `boilerplate.CONFIG` | string | — | argv only |

`boilerplate.CONFIG` lets you specify a config file path via `--config ./my.config.yaml` on the command line.
