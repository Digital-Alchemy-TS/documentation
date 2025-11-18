---
title: Advanced Configuration
---

This page covers advanced configuration topics including custom loaders, dynamic configuration changes, and complex configuration types.

## 🔧 Modifying Configurations

Some workflows may require changing values for configurations as part of their logic. This can be accomplished through [Internal](/docs/core/tools/internal) ServiceParams/internal methods. The `EVENT_CONFIGURATION_UPDATED` event is fired from `event` on each config update.

```typescript
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    internal.config.set("project", "CONFIG", newValue);
  });
}
```

## 📂 File Format Support

The file loader supports `ini`, `yaml`, and `json` formats. It searches for files in the following order:

> Set of extensions checked for each file:

- **auto** > `.json` > `.ini` > `.yaml` > `.yml`

Omitting the extension (**auto**) causes the loader to attempt to guess the file format:

1. Attempt `json`
2. Attempt `yaml`
3. Fallback to `ini`

> Search paths:

- `/etc/{app_name}` (Linux/macOS only)
- `cwd()`/`.app_name`
- `cwd()`/`..` (recursively to root)/`.app_name`
- `~/.config/{app_name}`

> The loader checks the `--config` switch as part of determining which file to load. If passed, the provided file will be the only one used.

```bash
tsx main.ts --config ./development_configuration
```

## 🖥️ Command Line Switches

Environment variables can be provided via command line switches for your application:

```bash
tsx main.ts --CACHE_PROVIDER=redis
# or
tsx main.ts --CACHE_PROVIDER redis
```

## 🏗️ Complex Configuration Types

### InternalConfig

For complex objects not captured by other config types, use `InternalConfig`:

```typescript
type NestedLibraryConfiguration = {
  port: number;
  foo?: string;
  bar?: boolean;
}

const MY_LIB = CreateLibrary({
  configuration: {
    COMPLEX_CONFIG: {
      type: "internal",
      description: "A configuration object needed by a separate library",
      default: { port: 8080 }
    } as InternalConfig<NestedLibraryConfiguration>
  },
  name: "my_lib"
});
```

## 🛒 Custom Loaders

Any function that returns a compatible configuration object can be used in place of the default `file` / `environment` loaders.

```typescript
// the loader, not registered as a service
async function MyCustomLoader({ application, configs, logger }: ConfigLoaderParams) {
  logger.trace("sending request");
  const data = await fetchMyConfiguration();
  logger.trace("done!");
  return data;
}

// service to do attachment
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
  internal.config.setConfigLoaders([
    MyCustomLoader,
    // not using file loaders for plot reasons
    // ConfigLoaderFile,
    ConfigLoaderEnvironment,
  ]);
}
```

## 🔄 Lifecycle Integration

Configuration changes can be integrated with the application lifecycle using `onPreInit`:

```typescript
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    // Modify configuration before initialization
    internal.config.set("my_lib", "STRING_CONFIG", "new_value");
  });
}
```

## ⚙️ Configuration Sources

You can control which configuration sources are used via bootstrap options:

```typescript
const app = CreateApplication({
  // ... other options
  bootstrap: {
    configSources: {
      env: true,    // Load from environment variables
      argv: true,   // Load from command line switches
      file: true    // Load from configuration files
    }
  }
});
```
