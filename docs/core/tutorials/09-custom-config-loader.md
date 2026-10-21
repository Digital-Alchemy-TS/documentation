---
title: Custom Config Loaders
sidebar_position: 10
description: "Load configuration from a remote store or other external source before native schema finalization."
---

Environment variables, CLI switches, and the optional file loader cover common deployments. A custom loader connects another source—such as a secrets manager, remote key/value API, or database—to the same configuration lifecycle.

## Loader timing and contract

A loader runs after the built-in env/argv pass and optional file loader, in the order it was registered. Core waits for every enabled loader, settles source precedence, and then processes schema-backed values through their native providers before `onPostConfig` callbacks run.

```typescript
type ConfigLoader = (params: ConfigLoaderParams) => Promise<Partial<AbstractConfig>>;
```

A loader should return a partial module/key object. For schema-backed entries, return the schema's input representation. A codec or transform is applied once during finalization; do not return the already-decoded output unless that is also the schema input.

Register a loader during service construction or `onPreInit`. Registering from `onBootstrap` is too late for the current configuration pass.

```typescript
import type {
  AbstractConfig,
  ConfigLoader,
  TServiceParams,
} from "@digital-alchemy/core";

export function RemoteConfigService({ internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    internal.boilerplate.configuration.registerLoader(
      async () => ({
        my_app: {
          DATABASE_URL: await fetchDatabaseUrl(),
          // A TypeBox codec could receive its encoded string here.
          RETRIES: "5",
        },
      }),
      "remote",
    );
  });
}
```

## Extending `ConfigLoaderSource`

Declare a custom name when it should be accepted by `registerLoader` and `configSources`:

```typescript
// src/config-loader.mts
declare module "@digital-alchemy/core" {
  interface ConfigLoaderSource {
    remote: true;
  }
}
```

Then a bootstrap can disable it for a local run:

```typescript
await MY_APP.bootstrap({
  configSources: {
    remote: false,
  },
});
```

Absence from `configSources` leaves a registered custom loader enabled. `configSources` is a loader-channel toggle; it does not disable explicit bootstrap configuration or public output-shaped mutations.

## Per-entry metadata

Extend `BaseConfig` when the remote store needs a key or namespace for each entry:

```typescript
// src/config-loader.mts
declare module "@digital-alchemy/core" {
  interface ConfigLoaderSource {
    remote: true;
  }

  interface BaseConfig {
    remote?: {
      key: string;
      namespace?: string;
    };
  }
}
```

Schema metadata still belongs on the schema itself:

```typescript
import { Type } from "typebox";

export const MY_APP = CreateApplication({
  name: "my_app",
  configuration: {
    DATABASE_URL: {
      schema: Type.String({ description: "Primary database URL" }),
      remote: { key: "db-connection-string", namespace: "shared" },
      source: ["remote"],
    },
    API_KEY: {
      schema: Type.String(),
      remote: { key: "api-key" },
      source: ["remote"],
    },
  },
  services: {},
});
```

`source: ["remote"]` prevents env, argv, and file loader values from replacing the key. It does not prevent an explicit bootstrap seed or a later output-shaped `set()`/`merge()` call.

## Scanning definitions

`params.configs` is a map from module names to their raw config definitions. Scan it for your extension metadata:

```typescript
const remoteMetadataLoader: ConfigLoader = async ({ configs, internal }) => {
  const result: Partial<AbstractConfig> = {};

  for (const [moduleName, moduleConfigs] of configs.entries()) {
    for (const [key, entry] of Object.entries(moduleConfigs)) {
      if (!entry.remote) continue;

      const value = await fetchRemote(entry.remote.key, entry.remote.namespace);
      internal.utils.object.set(result, `${moduleName}.${key}`, value);
    }
  }

  return result;
};
```

The raw `schema` value retains provider identity. Do not serialize it as part of a remote manifest. If a scanner or help command needs metadata, use `internal.boilerplate.configuration.getMetadata()`, which returns a safe view without executing default factories or provider callbacks.

## Parallel loading

For independent remote requests, collect promises and await them together:

```typescript
const parallelRemoteLoader: ConfigLoader = async ({ configs, internal }) => {
  const result: Partial<AbstractConfig> = {};
  const waiting: Promise<void>[] = [];

  for (const [moduleName, moduleConfigs] of configs.entries()) {
    for (const [key, entry] of Object.entries(moduleConfigs)) {
      if (!entry.remote) continue;

      waiting.push(
        (async () => {
          const value = await fetchRemote(entry.remote.key, entry.remote.namespace);
          internal.utils.object.set(result, `${moduleName}.${key}`, value);
        })(),
      );
    }
  }

  await Promise.all(waiting);
  return result;
};
```

Later custom loaders see raw previews from earlier loaders. They should not rely on a transform having already run.

## Error handling

Throw a `BootstrapException` for a fatal remote failure so bootstrap stops with a contextual error:

```typescript
import type { TContext } from "@digital-alchemy/core";
import { BootstrapException } from "@digital-alchemy/core";

async function loadRemoteValue(context: TContext) {
  return fetchRemote("database-url").catch(() => {
    throw new BootstrapException(
      context,
      "REMOTE_CONFIG_FETCH_FAILED",
      "Could not load remote configuration.",
    );
  });
}
```

Provider failures from the final schema pass use the sanitized `CONFIG_SCHEMA_*` causes. Do not echo secrets or raw input values in a custom error message.

## Development and production

A local run can disable the remote loader and provide explicit schema input:

```typescript
await MY_APP.bootstrap({
  configSources: {
    remote: false,
    file: false,
  },
  configuration: {
    my_app: {
      DATABASE_URL: "postgres://localhost/myapp_dev",
      API_KEY: "dev-test-key",
    },
  },
});
```

In production, enable the remote loader and disable file or argv channels as appropriate:

```typescript
await MY_APP.bootstrap({
  configSources: {
    file: false,
    argv: false,
    remote: true,
  },
});
```

The loader code stays the same. Source restrictions, provider validation, and final output processing remain in the core lifecycle.

For built-in source precedence, see [Config Sourcing](../reference/config/sourcing.md). For provider input/output and construction previews, see [Schema-backed Configuration](../reference/config/schemas.mdx).
