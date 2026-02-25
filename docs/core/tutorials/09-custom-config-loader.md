---
title: Custom Config Loaders
sidebar_position: 10
description: "Build a config loader that reads values from any external source and integrates natively with DA's configuration system."
---

The built-in sources — environment variables, CLI flags, and config files — cover most use cases. But any external store (a secrets manager, a remote key-value API, a database) requires a custom loader. This tutorial shows the complete shape.

## What a config loader is

A config loader is a function that runs during the `PostConfig` lifecycle phase, after defaults are applied but before `onPostConfig` callbacks fire. It receives the full config definition — all declared entries for every module in the application — and returns a partial config object to merge into the running config.

```typescript
type ConfigLoader = (params: ConfigLoaderParams) => Promise<Partial<AbstractConfig>>;
```

The return type `Partial<AbstractConfig>` mirrors the `bootstrap.configuration` shape:

```typescript
// Return values are merged like this:
{
  my_app: { DATABASE_URL: "postgres://remote-host/mydb" },
  my_lib: { API_KEY: "secret-from-vault" },
}
```

## Registering a loader

Loaders are registered from a service using `internal.boilerplate.configuration.registerLoader`:

```typescript
import type { TServiceParams } from "@digital-alchemy/core";

export function RemoteConfigService({ internal, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    internal.boilerplate.configuration.registerLoader(
      async (params) => {
        // fetch and return config values
        return {};
      },
      "remote", // loader name — must match a key in ConfigLoaderSource
    );
  });
}
```

The second argument is the loader name. It must be a key in `ConfigLoaderSource` — which means you need to declare it before you can register it.

## Extending ConfigLoaderSource

`ConfigLoaderSource` is an extensible interface. The built-in keys are `env`, `argv`, and `file`. Add your own key to make it a valid loader name and a valid `configSources` toggle:

```typescript title="src/config-loader.mts"
declare module "@digital-alchemy/core" {
  export interface ConfigLoaderSource {
    remote: true;
  }
}
```

Once declared, `"remote"` is a valid name for `registerLoader` and can be toggled in `configSources`:

```typescript
await MY_APP.bootstrap({
  configSources: {
    remote: false,  // skip remote loader in dev
  },
});
```

## Adding per-entry metadata with BaseConfig

The real power of a custom loader is the ability to annotate config entries with metadata that tells the loader which entries it should fetch. Do this by extending `BaseConfig`:

```typescript title="src/config-loader.mts"
declare module "@digital-alchemy/core" {
  export interface ConfigLoaderSource {
    remote: true;
  }

  export interface BaseConfig {
    remote?: { key: string; namespace?: string };
  }
}
```

Now any config entry can declare `remote: { key: "..." }`:

```typescript
export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    DATABASE_URL: {
      type: "string",
      required: true,
      remote: { key: "db-connection-string", namespace: "shared" },
    },
    API_KEY: {
      type: "string",
      required: true,
      remote: { key: "api-key" },
      source: ["remote"],  // restrict to remote only — never from env or file
    },
  },
  // ...
});
```

## Scanning config entries

`params.configs` is a `Map<string, Record<string, AnyConfig>>` — a map from module name to its config definitions. Iterate it to find entries with your metadata:

```typescript
async (params) => {
  const result: Partial<AbstractConfig> = {};

  for (const [moduleName, moduleConfigs] of params.configs.entries()) {
    for (const [key, entry] of Object.entries(moduleConfigs)) {
      if (!entry.remote) continue; // skip entries without our metadata

      const value = await fetchFromRemote(entry.remote.key, entry.remote.namespace);

      result[moduleName] ??= {};
      result[moduleName][key] = value;
    }
  }

  return result;
}
```

`entry.remote` is typed because we merged into `BaseConfig` — TypeScript knows the shape.

## Parallel loading

For many entries, sequential fetches are slow. Build a list of promises and await them together:

```typescript
async (params) => {
  const result: Partial<AbstractConfig> = {};
  const waiting: Promise<void>[] = [];

  for (const [moduleName, moduleConfigs] of params.configs.entries()) {
    for (const [key, entry] of Object.entries(moduleConfigs)) {
      if (!entry.remote) continue;

      waiting.push(
        (async () => {
          const value = await fetchFromRemote(entry.remote!.key, entry.remote!.namespace);
          result[moduleName] ??= {};
          result[moduleName][key] = value;
        })(),
      );
    }
  }

  await Promise.all(waiting);
  return result;
}
```

All fetch calls run concurrently. The result map is built up safely because each promise writes to a different key.

## Error handling

Use `BootstrapException` for fatal failures — errors that should halt the application rather than boot with a missing value:

```typescript
import { BootstrapException } from "@digital-alchemy/core";

// ...
const value = await fetchFromRemote(entry.remote.key).catch((error) => {
  throw new BootstrapException(
    context,
    "REMOTE_CONFIG_FETCH_FAILED",
    `Failed to load config key "${entry.remote.key}": ${error.message}`,
  );
});
```

`BootstrapException` triggers a clean shutdown with a logged error. The process exits before `onPostConfig` runs — so `required: true` entries that weren't populated never trigger the generic "missing required config" error; they get your specific error instead.

## Full example

A `RemoteConfigService` that fetches from a generic HTTP config endpoint:

```typescript title="src/services/remote-config.service.mts"
import { BootstrapException } from "@digital-alchemy/core";
import type { TServiceParams } from "@digital-alchemy/core";

export function RemoteConfigService({
  config,
  context,
  internal,
  lifecycle,
  logger,
}: TServiceParams) {
  lifecycle.onBootstrap(() => {
    internal.boilerplate.configuration.registerLoader(async (params) => {
      const endpoint = config.my_app.CONFIG_SERVICE_URL;
      const token = config.my_app.CONFIG_SERVICE_TOKEN;

      if (!endpoint) {
        logger.debug("no config service URL set, skipping remote loader");
        return {};
      }

      const result: Record<string, Record<string, string>> = {};
      const waiting: Promise<void>[] = [];

      for (const [moduleName, moduleConfigs] of params.configs.entries()) {
        for (const [key, entry] of Object.entries(moduleConfigs)) {
          if (!entry.remote) continue;

          waiting.push(
            (async () => {
              const url = `${endpoint}/config/${entry.remote!.namespace ?? "default"}/${entry.remote!.key}`;
              const response = await globalThis.fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
              }).catch((error) => {
                throw new BootstrapException(
                  context,
                  "CONFIG_FETCH_FAILED",
                  `Could not reach config service for "${entry.remote!.key}": ${error.message}`,
                );
              });

              if (!response.ok) {
                throw new BootstrapException(
                  context,
                  "CONFIG_FETCH_HTTP_ERROR",
                  `Config service returned ${response.status} for key "${entry.remote!.key}"`,
                );
              }

              const { value } = await response.json();
              result[moduleName] ??= {};
              result[moduleName][key] = value;
              logger.trace({ key: entry.remote!.key, moduleName }, "loaded remote config");
            })(),
          );
        }
      }

      await Promise.all(waiting);
      logger.debug({ count: waiting.length }, "remote config loaded");
      return result;
    }, "remote");
  });
}
```

## Using the loader in config entries

Config entries that should come from the remote loader declare the `remote` property:

```typescript
export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    // Values from the config service
    DATABASE_URL: {
      type: "string",
      required: true,
      remote: { key: "database-url" },
    },
    THIRD_PARTY_API_KEY: {
      type: "string",
      required: true,
      remote: { key: "third-party-api-key", namespace: "shared-secrets" },
      source: ["remote"],  // can't be overridden by env or file
    },

    // Non-remote values (normal env/file sources)
    CONFIG_SERVICE_URL: {
      type: "string",
    },
    CONFIG_SERVICE_TOKEN: {
      type: "string",
      required: true,
      source: ["env"],
    },
  },
  // ...
});
```

## Dev vs prod

In development, skip the remote loader entirely using `configSources`:

```typescript title="src/main.mts  (local development)"
await MY_APP.bootstrap({
  configSources: {
    remote: false,  // use env/file in dev
  },
  configuration: {
    my_app: {
      DATABASE_URL: "postgres://localhost/myapp_dev",
      THIRD_PARTY_API_KEY: "dev-test-key",
    },
  },
});
```

```typescript title="src/main.mts  (production)"
await MY_APP.bootstrap({
  configSources: {
    file: false,   // no config files in prod
    argv: false,   // no CLI flags
    remote: true,  // remote loader active (this is also the default if not specified)
  },
});
```

The loader code itself doesn't need to change between environments — the `configSources` toggle handles it.

## Summary

- Extend `ConfigLoaderSource` to register your loader name as a valid key
- Extend `BaseConfig` to add per-entry metadata that config authors use to annotate which entries your loader handles
- In your loader, iterate `params.configs.entries()` to find annotated entries
- Use `Promise.all()` for parallel fetches
- Throw `BootstrapException` for fatal failures
- Toggle the loader with `configSources` so it only runs in deployed environments

For existing config source patterns and merge order, see [Config Sourcing](../reference/config/sourcing.md).
