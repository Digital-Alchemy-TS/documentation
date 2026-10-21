---
title: Config Sourcing
sidebar_position: 3
description: "Environment, CLI, file, and custom loader inputs, precedence, and source restrictions."
---

Configuration values are collected from declarations and enabled loaders. Core settles source precedence first, then processes each winning schema value through its native provider.

## Source order

```text
declaration defaults / bootstrap inputs
  → env + argv (argv wins within this pass)
  → optional file loader
  → registered custom loaders, in registration order
  → native schema processing
  → onPostConfig
```

`bootstrap({ configuration })` and `TestRunner.configure()` provide early input values. They are not an unconditional highest-priority override: an enabled later loader can replace them. Legacy values retain their historical merge behavior; schema values replace atomically at the configuration-key boundary.

All loaders settle before native processing and one complete processed snapshot is published. A later custom loader can inspect raw previews from earlier loaders, but should not treat them as final provider output.

## Built-in loaders

| Loader | Enabled by default in normal bootstrap | Input |
|---|---:|---|
| `env` | Yes | Environment variables, including dotenv values |
| `argv` | Yes | CLI switches |
| `file` | No; opt in with `configSources.file: true` | JSON, YAML, or INI config files |

Disable or enable channels with `configSources`:

```typescript
await MY_APP.bootstrap({
  configSources: {
    env: true,
    argv: false,
    file: true,
  },
});
```

The `source` field on an entry is a per-key allow-list for these loader names and for registered custom names. It does not block explicit bootstrap input or output-shaped public mutation.

## Environment variables and CLI

For a module named `my_app` and key `PORT`, use the double-underscore form:

```bash
MY_APP__PORT=8080
node dist/app.mjs --my_app__PORT=8080
```

Core searches each key in these forms, in order:

1. `MODULE__KEY` — preferred
2. `MODULE_KEY` — compatibility form
3. `KEY` — bare fallback

The same search is performed for CLI switches and environment variables, but a matching CLI switch wins over an environment value. Module hyphens and underscores are treated as interchangeable during lookup. Use underscore forms in deployment commands; dot notation such as `--my_app.PORT=8080` is not the documented key form.

The file switch is separate from a configuration key:

```bash
node dist/app.mjs --config ./config/production.yaml
```

`--config` selects the file loader's path; it is not a `my_app` key. The boilerplate `CONFIG` entry can also provide the path when the file loader is enabled.

## Dotenv is separate from the config-file loader

The environment loader can load dotenv values into `process.env` before it searches environment keys. `envFile` and the `--env-file` switch select that dotenv file; `.env` in the working directory is the fallback.

```typescript
await MY_APP.bootstrap({
  envFile: ".env.production",
});
```

Dotenv is not the configuration-file format. The opt-in `file` loader reads JSON, YAML, and INI files and maps their object structure to module and key names. A `.env` file supplies environment variables instead.

## File configuration

Enable the file loader explicitly:

```typescript
await MY_APP.bootstrap({
  configSources: { file: true },
});
```

With no explicit path, core searches its standard application config locations. `--config path` or `boilerplate.CONFIG` selects one file. Supported formats are JSON, YAML/YML, and INI:

```yaml
my_app:
  DATABASE_URL: postgres://localhost/mydb
  PORT: 8080
```

For a file-backed schema object, use JSON text where the winning value reaches a TypeBox object, record, or array root. Native schema processing then performs conversion, defaults, validation, and decoding. A JSON-looking value for a normal TypeBox string remains a string.

## Restricting a key to a source

```typescript
const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    SECRET_KEY: {
      schema: Type.String(),
      source: ["env"],
    },
    PORT: {
      schema: Type.Integer({ default: 3000 }),
      source: ["env", "argv"],
    },
  },
  services: {},
});
```

A file or custom loader cannot replace `SECRET_KEY`. An explicit bootstrap value still seeds it because `source` is a loader allow-list, not a general mutation guard.

## Custom loaders

Register a custom loader during service construction or `onPreInit`, before configuration initialization:

```typescript
export function RemoteConfigService({ internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    internal.boilerplate.configuration.registerLoader(
      async () => ({
        my_app: {
          // Return schema input; final native processing happens later.
          PORT: "8080",
        },
      }),
      "remote",
    );
  });
}
```

Custom loaders run after the built-in env/argv and optional file loaders, in registration order. Declare the custom name in `ConfigLoaderSource` if you want it accepted by the typed `registerLoader` and `configSources` surfaces:

```typescript
declare module "@digital-alchemy/core" {
  interface ConfigLoaderSource {
    remote: true;
  }
}
```

Disable a custom loader with `configSources.remote: false`. See [Custom Config Loaders](../../tutorials/09-custom-config-loader.md) for metadata scanning, error handling, and a complete remote example.

## Programmatic updates

`internal.boilerplate.configuration.set(project, property, value)` emits an update event for one live value. `merge()` applies a bulk output-shaped update without emitting per-key events. Neither method re-runs schema processing, so transformed entries must receive their provider output type.

For final-value timing and previews, see [Accessing Config](./access.md). For provider input/output and migration rules, see [Schema-backed Configuration](./schemas.mdx).
