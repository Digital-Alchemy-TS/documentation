---
title: Sourcing
id: core-configuration-sourcing
sidebar_position: 4
description: ""
---

The configuration system uses a set of priorities to determine the value of a given configuration variable.
By default, values are loaded in the following order:

1. Hard-coded defaults in the library/application.
2. Values provided to the bootstrap function for the application.
3. User data (determined after `onPreInit`, and before `onPostConfig`):
    1. Environment variables (including .env files)
    2. Command line switches
    3. Configuration files
    4. Custom loaders

## Module definitions

Configuration can be provided directly during bootstrap, which takes priority over module defaults:

```typescript
export const MY_APPLICATION = CreateApplication({
  configuration: {
    BASE_URL: {
      type: "string",
      default: "http://localhost:3032" // absolute default for this property
    },
    FEATURE_ENABLED: {
      type: "boolean",
      default: false
    }
  },
  name: "example_application",
});
```

## Application bootstrap

Individual application entrypoints are able to override the module level configurations specific functionality.
This might

```typescript
MY_APPLICATION.bootstrap({
  configuration: {
    example_application: {
      BASE_URL: "https://dev-api.some-domain.com",
      FEATURE_ENABLED: true
    }
  }
})
```

## Built-in loader notes

### Environment Variables

Environment variables are **case insensitive**, and `-` & `_` may be swapped. For the configuration example `CACHE_PROVIDER`, these are allowed variations:

- `CACHE_PROVIDER`
- `cache-provider`
- `caChE-PrOvIDERE`

#### Built-in .env Support

The system automatically loads environment variables from `.env` files using [@dotenvx/dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx). The loading priority is:

1. `--env-file` CLI switch
2. `envFile` option in bootstrap configuration
3. Default `.env` file in current working directory

```bash
# Use a specific .env file
tsx main.ts --env-file ./production.env
```

```typescript
// Or set in bootstrap options
const app = CreateApplication({
  // ... other options
  bootstrap: {
    envFile: "./production.env"
  }
});
```

> **Note**: The system uses [@dotenvx/dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx) which supports encrypted environment variables, allowing you to securely store sensitive configuration values in your `.env` files.

#### via environment variables

```bash
# source from the environment variables in your session
export CACHE_PROVIDER=redis
tsx main.ts

# define inline
CACHE_PROVIDER=REDIS tsx main.ts
```

### Command line switches

```bash
tsx main.ts --CACHE_PROVIDER=redis
# or
tsx main.ts --CACHE_PROVIDER redis
```

## Config files

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
