---
title: Configuration Overview
sidebar_position: 1
description: "What config is in DA Core: LOAD_PROJECT, ModuleConfiguration, TInjectedConfig."
---

Configuration in Digital Alchemy is module-scoped and type-safe. Each module (application or library) declares its configuration entries alongside its services. The framework collects all declarations at boot time, applies values from environment variables, CLI arguments, and config files, validates required entries, and hands every service a typed `config` object.

## How it works

**Declaration** — Configuration entries are part of the module definition:

```typescript
export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    DATABASE_URL: { type: "string", required: true },
    PORT:         { type: "number", default: 3000 },
  },
  services: { ... },
});
```

**Collection** — During wiring, each module calls `LOAD_PROJECT` to register its config definitions with the configuration service. This happens before any lifecycle stages run.

**Application** — At `PostConfig`, the configuration service:
1. Reads values from env / argv / file sources (in merge order)
2. Validates that all `required: true` entries have a value
3. Emits `REQUIRED_CONFIGURATION_MISSING` and halts bootstrap if any required entry is missing

**Access** — Services read config via `config.module_name.KEY`:

```typescript
export function ApiService({ config }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    const url: string = config.my_app.DATABASE_URL;
    const port: number = config.my_app.PORT;
  });
}
```

## Module scoping

Config is always namespaced by module name. `MY_APP`'s config is at `config.my_app.*`; `MY_LIB`'s config is at `config.my_lib.*`. Modules cannot see each other's config entries (except through explicit service calls).

The boilerplate module provides its own config at `config.boilerplate.*`:

| Key | Type | Default |
|---|---|---|
| `boilerplate.LOG_LEVEL` | enum | `"trace"` |
| `boilerplate.NODE_ENV` | string | `process.env.NODE_ENV \|\| "local"` |
| `boilerplate.IS_TEST` | boolean | `true` when `NODE_ENV` starts with `"test"` |
| `boilerplate.CONFIG` | string | — (argv only) |

## TInjectedConfig

`TInjectedConfig` is the TypeScript type of `config`. It's automatically computed from all `LoadedModules` declarations — one namespace per module, one property per config entry, typed according to the entry's `type` and `enum` fields.

You never write `TInjectedConfig` directly. It updates automatically as you add config entries to your modules.

## CONFIG_LOADED_EVENT

When `configuration.set(project, property, value)` is called programmatically, the framework emits `"event_configuration_updated"` on the event bus with `(project, property)` as arguments. Use `configuration.onUpdate()` to subscribe to these changes.

## See also

- [Configuration Types](./types.mdx) — all six types with TypeScript mappings
- [Config Sourcing](./sourcing.md) — env, argv, file loaders; merge order
- [Accessing Config](./access.md) — timing, required entries, source restriction
