---
title: Configuration
---

The configuration system is designed to provide a managed experience for applications. Definitions are built into modules, and the system sources values from both files and environment sources.

## 🏗️ Building Values

### 🔝 Priorities

The configuration system uses a set of priorities to determine the value of a given configuration variable. Values are loaded in the following order:

1. Hard-coded default in the library/application.
2. Values provided to the bootstrap function.
3. User data (determined after `onPreInit`, and before `onPostConfig`):
    1. Environment variables (including .env files)
    2. Command line switches
    3. Configuration files

## 📐 Defining Configurations

> Definitions are provided as part of the library/application creation

```typescript
const MY_LIB = CreateLibrary({
  configuration: {
    STRING_CONFIG: {
      type: "string",
      description: "An example string configuration",
      default: "foo"
    },
    ENUM_CONFIG: {
      type: "string",
      description: "Another example string configuration",
      default: "foo",
      enum: ["foo","bar"]
    } as StringConfig<"foo" | "bar">,
    NUMBER_CONFIG: {
      type: "number",
      description: "A numeric configuration",
      default: 8080
    },
    BOOLEAN_CONFIG: {
      type: "boolean",
      description: "A boolean configuration",
      default: false
    }
  },
  name: "my_lib"
});
```

This creates the following configuration variables:

- `config.my_lib.STRING_CONFIG` (generic `string`)
- `config.my_lib.ENUM_CONFIG` (string union)
- `config.my_lib.NUMBER_CONFIG` (`number`)
- `config.my_lib.BOOLEAN_CONFIG` (`boolean`)

### Supported Types

| Type       | Notes                                                            | Extras                                                                             |
| ---------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `string`   | Strings and things that extend them                              | `enum: string[]` property may also be supplied                                     |
| `string[]` | An array of strings                                              |                                                                                    |
| `boolean`  | Simple boolean configurations                                    | Using CLI switches, just passing `--CONFIG_NAME` can be used for passing true     |
| `number`   | Simple number configurations                                     |                                                                                    |
| `record`   | `Record<string, string>` for defining key/value pairs of strings |                                                                                    |

For complex configuration types, see [Advanced Configuration](/docs/core/techniques/configuration-advanced).

## 🔑 Accessing Configurations

> Values are provided via service params and are accessible in `.project.value` format.

```typescript
export function MyService({ logger, config, lifecycle }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    // Properly cast to the string union
    logger.info(`value for ENUM_CONFIG is`, config.my_lib.ENUM_CONFIG);
  });
}
```

## 🌍 Environment Variables

Environment variables are **case insensitive**, and `-` & `_` may be swapped. For the configuration example `CACHE_PROVIDER`, these are allowed variations:

- `CACHE_PROVIDER`
- `cache-provider`
- `caChE-PrOvIDERE`

### Built-in .env Support

The system automatically loads environment variables from `.env` files using [@dotenvx/dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx). The loading priority is:

1. `--env-file` CLI switch
2. `envFile` option in bootstrap configuration
3. Default `.env` file in current working directory

```bash
# Use a specific .env file
tsx main.ts --env-file ./production.env

# Or set in bootstrap options
const app = CreateApplication({
  // ... other options
  bootstrap: {
    envFile: "./production.env"
  }
});
```

> **Note**: The system uses [@dotenvx/dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx) which supports encrypted environment variables, allowing you to securely store sensitive configuration values in your `.env` files.

### Setting Environment Variables

#### via environment variables

```bash
# source from the environment variables in your session
export CACHE_PROVIDER=redis
tsx main.ts

# define inline
CACHE_PROVIDER=REDIS tsx main.ts
```

#### via command line switches

```bash
tsx main.ts --CACHE_PROVIDER=redis
# or
tsx main.ts --CACHE_PROVIDER redis
```

## 📂 File Based Configuration

The system supports configuration files in multiple formats. For detailed information about file format support, search paths, and advanced file loading options, see [Advanced Configuration](/docs/core/techniques/configuration-advanced).

## 🔧 Bootstrap Configuration

Configuration can be provided directly during bootstrap, which takes priority over module defaults:

```typescript
const app = CreateApplication({
  // ... other options
  bootstrap: {
    configuration: {
      my_lib: {
        STRING_CONFIG: "override_value"
      }
    }
  }
});
```

## 🔄 Advanced Topics

For advanced configuration topics including:
- Custom configuration loaders
- Dynamic configuration changes
- Complex configuration types (`InternalConfig`)
- File format support details
- Lifecycle integration

See [Advanced Configuration](/docs/core/techniques/configuration-advanced).
