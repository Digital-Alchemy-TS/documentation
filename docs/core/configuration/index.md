---
title: Configuration
id: core-configuration
sidebar_position: 4
description: ""
---

The configuration system is designed to provide a managed experience for applications. Definitions are built into modules, and the system sources values from both files and environment sources.

## Defining Configurations

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

## Using configs

> Values are provided via service params and are accessible in `.project.value` format.

```typescript
export function MyService({ logger, config, lifecycle }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    // Properly cast to the string union
    logger.info(`value for ENUM_CONFIG is`, config.my_lib.ENUM_CONFIG);
  });
}
```
