## 📝 Description

- #TServiceParams/config

The configuration system is designed to provide a managed experience for applications. Definitions are built into modules, and the system sources values from both files and environment sources.

## 🏗️ Building Values

### 🔝 Priorities

The configuration system uses a set of priorities to determine the value of a given configuration variable. With some application flows, the value may differ depending on when you check. Values are loaded in the following order, which are the default intended ways to interact with the system:

1. Hard-coded default in the library/application.
2. Values provided to the bootstrap function (#Lifecycle/Bootstrap).
3. User data (determined after #Lifecycle/onPreInit, and before #Lifecycle/onPostConfig):
	1. Files
	2. Environment variables
	3. Command line switches

> Note: Some code may manually set values during construction or #Lifecycle/onPreInit.

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

> Specify your own:

The loader checks the `--config` switch as part of determining which file to load. If passed, the provided file will be the only one used.
```bash
tsx main.ts --config ./development_configuration
```
### 🌍 Environment Based

Environment variables are **case insensitive**, and `-` & `_` may be swapped. For the configuration example `boilerplate.CACHE_PROVIDER`, these are allowed variables:

- `CACHE_PROVIDER`
- `cache-provider`
- `caChE-PrOvIDERE`

These can be used as environment variables or command line switches for your application.

```bash
# Send value as an environment variable
CACHE_PROVIDER=redis tsx main.ts

# Send value as a switch
tsx main.ts --CACHE_PROVIDER=redis
# or
tsx main.ts --CACHE_PROVIDER redis
```

## 🛠️ Usage

### 📐 Defining Configurations

Definitions are provided as part of the library/application creation.

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
		COMPLEX_CONFIG: {
			type: "internal",
			description: "A configuration object needed by a separate library",
			default: { port: 8080 }
		} as InternalConfig<NestedLibraryConfiguration>
	},
	name: "my_lib"
});
```

This creates the following configuration variables:
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

Values are provided via service params and are accessible in `.project.value` format.

```typescript
export function MyService({ logger, config, lifecycle }: TServiceParams) {
  lifecycle.onPostConfig(() => {
	  // Properly cast to the string union
	  logger.info(`value for ENUM_CONFIG is`, config.my_lib.ENUM_CONFIG);
  });
}
```
### ✏️ Modifying Configurations

Some workflows may require changing values for configurations as part of their logic. This can be accomplished through the #T

ServiceParams/internal methods. The `EVENT_CONFIGURATION_UPDATED` event is fired from #TServiceParams/event on each config update.
```typescript
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
	lifecycle.onPreInit(() => {
		internal.config.set("project", "CONFIG", newValue);
	});
}
```
### 🛒 Custom Loaders

Any function that returns a compatible configuration object can be used in place of the default `file` / `environment` loaders.

```typescript
async function Loader({ application, configs, logger }: ConfigLoaderParams) {
    logger.trace("sending request");
	const data = await fetchMyConfiguration();
    logger.trace("done!");
	return data;
}
export function MyService({ logger, internal, lifecycle }: TServiceParams) {
	// Attach to the bootstrap
	internal.config.addConfigLoader([Loader,5]);
}
```

> [!warning] Adding your own loader will cause the default loaders not to attach by default.
> You can add them back with their priority relative to yours by using `ConfigLoaderFile` & `ConfigLoaderEnvironment`.