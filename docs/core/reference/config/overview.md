---
title: Configuration Overview
sidebar_position: 1
description: "What configuration is in DA Core: module declarations, source loading, and TInjectedConfig."
---

Digital Alchemy configuration is module-scoped and type-safe. Each application or library declares entries alongside its services. An entry can use the legacy `type` form or a native `schema` form; both forms can coexist in one module.

```typescript
import { Type } from "typebox";
import { CreateApplication } from "@digital-alchemy/core";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    DATABASE_URL: {
      schema: Type.String({ description: "Database connection URL" }),
    },
    PORT: {
      schema: Type.Integer({ default: 3000 }),
    },
    // Legacy entries remain supported during migration.
    LOG_LEVEL: {
      type: "string",
      default: "info",
    },
  },
  services: {},
});
```

For the schema declaration contract, provider behavior, input/output types, and migration table, see [Schema-backed Configuration](./schemas.mdx).

## How it works

**Declaration** — `CreateApplication` and `CreateLibrary` collect configuration definitions. A definition provides exactly one of `type` or `schema`.

**Collection** — During wiring, each module registers its definitions with the configuration service. Legacy defaults and supported TypeBox root defaults may be visible while services are constructed; external sources have not settled yet.

**Source loading** — After `PreInit`, core loads enabled environment and CLI values, the optional config-file loader, and registered custom loaders. The order is [documented in Config Sourcing](./sourcing.md); bootstrap configuration is an early seed, not an unconditional final override.

**Finalization** — Once every enabled loader settles, legacy values are coerced and schema values are processed through their native provider. Core publishes one complete processed snapshot and then runs `onPostConfig` callbacks. A schema failure prevents a partial processed snapshot from being published.

**Access** — Services read final values through `config.<module_name>.<KEY>` from `onPostConfig` or a later lifecycle stage:

```typescript
export function ApiService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    const url: string = config.my_app.DATABASE_URL;
    const port: number = config.my_app.PORT;
    logger.info({ url, port }, "configuration loaded");
  });
}
```

## Module namespaces

Configuration is grouped by module name: `MY_APP` is available at `config.my_app.*` and `MY_LIB` at `config.my_lib.*`. Namespaces organize keys and shape `TInjectedConfig`; they are not access-control boundaries. A service can read another loaded module's configuration when the module is part of the application's typed graph. Use service APIs when you need a stronger ownership boundary.

The boilerplate module provides its own legacy configuration at `config.boilerplate.*`:

| Key | Type | Default or source |
|---|---|---|
| `boilerplate.LOG_LEVEL` | string enum | `"trace"` |
| `boilerplate.NODE_ENV` | string | `process.env.NODE_ENV \|\| "local"` |
| `boilerplate.IS_TEST` | boolean | true when `NODE_ENV` starts with `"test"` |
| `boilerplate.CONFIG` | string | `--config` / argv input for the file loader |

The `boilerplate.CONFIG` path is a file-loader input. It is separate from dotenv loading through `envFile` or `--env-file`.

## TInjectedConfig

`TInjectedConfig` is the TypeScript type of the injected `config` object. It is computed from the loaded module declarations: one namespace per module and one property per entry. Legacy entries map from their `type`; schema entries map to the provider's output type.

For schemas with transforms or codecs, the injected output type can differ from the input accepted by `bootstrap({ configuration })`, `TestRunner.configure()`, and loaders. See [Schema input and output](./schemas.mdx#input-and-output-types).

## Configuration updates

`internal.boilerplate.configuration.set(project, property, value)` updates one live value and emits `event_configuration_updated` to `configuration.onUpdate()` subscribers. `set()` and `merge()` are output-shaped mutation APIs: they do not run native schema processing again. Use values that already satisfy the injected output type.

## See also

- [Schema-backed Configuration](./schemas.mdx) — native providers, lifecycle, failures, and migration
- [Legacy Configuration Types](./types.mdx) — compatibility types and parsing rules
- [Config Sourcing](./sourcing.md) — env, argv, file, and custom loader order
- [Accessing Config](./access.md) — timing, optionality, and mutation boundaries
