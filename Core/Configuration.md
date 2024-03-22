---
tags: []
aliases:
---
## 📝 Description

The configuration system is designed to provide a managed experience for applications. Definitions are built into modules, and the system sources values from both files and environment sources.

## 🏗️ Building Values

### 🔝 Priorities

The configuration system uses a set of priorities to determine the value of a given configuration variable. With some application flows, the value may differ depending on when you check. Values are loaded in the following order, which are the default intended ways to interact with the system:

1. Hard-coded default in the library/application.
2. Values provided to the bootstrap function (#Lifecycle/Bootstrap).
3. User data (determined after [[onPreInit]], and before [[onPostConfig]]):
	1. Files
	2. Environment variables
	3. Command line switches

> Note: Some code may manually set values during construction or [[onPreInit]].

### 📂 File Based

The file loader supports `ini`, `yaml`, and `json` formats. It searches for files in the following order:

> Set of extensions checked for each file:
- **auto** > `.json` > `.ini` > `.yaml` > `.yml`

Omitting the extension (**auto**) causes the loader to attempt to guess the file format:
1. Attempt `json`
2. Attempt `yaml`
3. Fallback to `ini`

> Search paths:
- `cwd()`/`.app_name`
- `cwd()`/`..` (recursively to root)/`.app_name`
- `~/.config/{app_name}`
- `~/.config/{app_name}/config`

> [!example] #Usage-Example/core
> The loader checks the [[CONFIG|--config]] switch as part of determining which file to load. If passed, the provided file will be the only one used.
```bash
tsx main.ts --config ./development_configuration
```
### 🌍 Environment Based

Environment variables are **case insensitive**, and `-` & `_` may be swapped. For the configuration example [[CACHE_PROVIDER]], these are allowed variations:

- `CACHE_PROVIDER`
- `cache-provider`
- `caChE-PrOvIDERE`

> [!example] #Usage-Example/core
> These can be used as environment variables or command line switches for your application.

**via environment variables**
```bash
# source from the environment variables in your session
export CACHE_PROVIDER=redis
tsx main.ts

# define inline
CACHE_PROVIDER=REDIS tsx main.ts
```
**via command line switches**
```bash
tsx main.ts --CACHE_PROVIDER=redis
# or
tsx main.ts --CACHE_PROVIDER redis
```

## 🛠️ Usage

### 📐 Defining Configurations

> [!example] #Usage-Example/core
> Definitions are provided as part of the library/application creation

```typescript
type NestedLibraryConfiguration = {
  port: number;
  foo?: string;
  bar?: boolean;
}
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
    COMPLEX_CONFIG: {
      type: "internal",
      description: "A configuration object needed by a separate library",
      default: { port: 8080 }
    } as InternalConfig<NestedLibraryConfiguration>
  },
  name: "my_lib"
});
```

This creates the following configuration variables (*referenced in examples below*):
- `config.my_lib.STRING_CONFIG` (generic `string`)
- `config.my_lib.ENUM_CONFIG` (string union)
- `config.my_lib.COMPLEX_CONFIG` (`NestedLibraryConfiguration`)

Types may be in the following formats:

| Type       | Notes                                                            | Extras                                                                             |
| ---------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `string`   | Strings and things that extend them                              | `enum: string[]` property may also be supplied                                     |
| `string[]` | An array of strings                                              |                                                                                    |
| `boolean`  | Simple boolean configurations                                    | Using CLI switches, just passing `--CONFIG_NAME` can be used for passing true     |
| `number`   | Simple number configurations                                     |                                                                                    |
| `record`   | `Record<string, string>` for defining key/value pairs of strings |                                                                                    |
| `internal` | Complex objects not captured by other config types               |                                                                                    |

### 🔑 Accessing Configurations

> [!example] #Usage-Example/core
> Values are provided via service params and are accessible in `.project.value` format.

```typescript
export function MyService({ logger, config, lifecycle }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    // Properly cast to the string union
    logger.info(`value for ENUM_CONFIG is`, config.my_lib.ENUM_CONFIG);
  });
}
```
### ✏️ Modifying Configurations

Some workflows may require changing values for configurations as part of their logic. This can be accomplished through [[Internal]]

ServiceParams/internal methods. The `EVENT_CONFIGURATION_UPDATED` event is fired from [[Event]] on each config update.

> [!example] #Usage-Example/core
```typescript
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    internal.config.set("project", "CONFIG", newValue);
  });
}
```
### 🛒 Custom Loaders

> [!example] #Usage-Example/core
> Any function that returns a compatible configuration object can be used in place of the default `file` / `environment` loaders.

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

> [!warning] Adding your own loader will cause the default loaders not to attach by default.
> You can add them back with their priority relative to yours by using [[ConfigLoaderFile]] & [[ConfigLoaderEnvironment]].