---
title: Configuration
sidebar_label: Overview
sidebar_position: 1
description: "Type-safe configuration in Digital Alchemy Core."
---

The configuration system turns external values (environment variables, config files, CLI flags) into typed, validated objects available on `TServiceParams` as `config.module_name.KEY`.

| | |
|---|---|
| [Defining](./defining.md) | Declare config entries as part of a module |
| [Types](./types.md) | All supported config types: string, number, boolean, enum, string[], record |
| [Sources](./sources.md) | Where values come from: env, argv, files, bootstrap overrides |
| [Using](./using.md) | Accessing config in services; when values are available |

## How it works

Config definitions live in the module that owns them. At boot, the framework collects all definitions, loads values from available sources, and validates required entries. After `PostConfig`, `config.*` is fully typed and safe to read.

```typescript
// Define
CreateLibrary({
  name: "my_lib",
  configuration: {
    API_URL:  { type: "string", required: true },
    TIMEOUT:  { type: "number", default: 30 },
    VERBOSE:  { type: "boolean", default: false },
  },
});

// Use
export function MyService({ config }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    fetch(config.my_lib.API_URL, { signal: AbortSignal.timeout(config.my_lib.TIMEOUT * 1000) });
  });
}
```
