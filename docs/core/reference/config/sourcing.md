---
title: Config Sourcing
sidebar_position: 3
description: "ConfigLoaderSource: argv, env, file — merge order and custom loaders."
---

Configuration values come from multiple sources. The framework merges them in a defined order, with later sources overriding earlier ones.

## Sources

| Source | How it works |
|---|---|
| `default` | Declared in the config entry definition |
| `env` | Environment variables (`MY_APP__PORT=3000`) |
| `argv` | CLI flags (`--my_app.PORT=3000`) |
| `file` | Config file at the path specified by `boilerplate.CONFIG` or `.env` |

## Merge order

```
defaults → env + argv → file → bootstrap.configuration
```

Later sources win. `bootstrap.configuration` has the highest priority — it overrides everything.

:::note
`env` and `argv` are processed together in a single pass. There is no ordering between them.
:::

## Environment variable format

Keys follow this pattern: `MODULE_NAME__KEY_NAME` (module name + double underscore + key name, all uppercase).

```bash
MY_APP__PORT=8080
MY_APP__DATABASE_URL=postgres://localhost/mydb
MY_LIB__BASE_URL=https://api.example.com
```

For the boilerplate module: `BOILERPLATE__LOG_LEVEL=debug`.

### Lookup precedence

For each config entry, the loader searches the env (and argv) for the first matching name, in this order:

1. `MODULE_NAME__KEY_NAME` (double underscore) — **preferred**; unambiguous when module names contain underscores, and friendlier to env var names with embedded special characters
2. `MODULE_NAME_KEY_NAME` (single underscore) — classic format, accepted for compatibility
3. `KEY_NAME` (bare, no module prefix) — fallback for app-wide overrides like `NODE_ENV`

Module names with hyphens are normalized to underscores before matching (`my-lib` matches `MY_LIB__KEY` and `MY_LIB_KEY`). Use the double-underscore form in deployment scripts and `.env` files; the single-underscore form is loss-prone when a module name itself contains an underscore.

## CLI argv format

Keys follow dot notation with the module name: `--module.KEY=value`.

```bash
node dist/app.js --my_app.PORT=8080 --boilerplate.LOG_LEVEL=debug
```

Use `--config ./path/to/config.yaml` (via `boilerplate.CONFIG`) to specify a config file path.

## Config file

The framework reads a config file if `boilerplate.CONFIG` is set (via `--config ./file`) or if a `.env` file exists in the working directory. The file path is configurable via `envFile` in `BootstrapOptions`.

Config files support YAML, JSON, and `.env` formats. Structure mirrors the `configuration` object in `bootstrap()`:

```yaml
my_app:
  DATABASE_URL: postgres://localhost/mydb
  PORT: 8080
my_lib:
  BASE_URL: https://api.example.com
```

## Restricting sources per entry

Use the `source` property on a config entry to restrict which loaders can set it:

```typescript
CONFIG: {
  type: "string",
  source: ["argv"],  // only settable via CLI flag, not env or file
}
```

The `boilerplate.CONFIG` entry uses `source: ["argv"]` — it can only be set via the command line.

## Disabling sources

Disable specific config loaders globally via `configSources` in `BootstrapOptions`:

```typescript
await MY_APP.bootstrap({
  configSources: {
    env:  false,  // ignore environment variables
    argv: false,  // ignore CLI flags
    file: false,  // ignore config files
  },
});
```

All sources default to enabled.

## Reacting to config changes

`configuration.onUpdate(callback, project?, property?)` subscribes to runtime config updates. Fires when `configuration.set()` is called programmatically:

```typescript
export function MyService({ internal }: TServiceParams) {
  // Subscribe to all config changes
  internal.boilerplate.configuration.onUpdate((project, property) => {
    logger.info({ project, property }, "config updated");
  });

  // Subscribe to changes in my_app only
  internal.boilerplate.configuration.onUpdate(
    (project, property) => { /* ... */ },
    "my_app",
  );

  // Subscribe to a specific key
  internal.boilerplate.configuration.onUpdate(
    (project, property) => { /* ... */ },
    "my_app",
    "PORT",
  );
}
```

## Programmatic updates

`configuration.set(project, property, value)` updates a config value at runtime and emits `"event_configuration_updated"`:

```typescript
internal.boilerplate.configuration.set("my_app", "PORT", 9000);
```

## Custom loaders

Register a custom loader with `registerLoader(loader, name)`. The loader is a function that returns a `Partial<AbstractConfig>` — a deep partial of the full config shape:

```typescript
export type ConfigLoader = (params: ConfigLoaderParams) => Promise<Partial<AbstractConfig>>;
```

```typescript
internal.boilerplate.configuration.registerLoader(
  async ({ application, configs, internal, logger }) => {
    // Fetch from a remote config service, read from a database, etc.
    const values = await fetchRemoteConfig();
    return values; // shape: { my_app: { PORT: 8080 } }
  },
  "my_custom_source", // arbitrary type name
);
```
