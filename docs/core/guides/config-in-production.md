---
title: Config in Production
sidebar_position: 7
description: "Practical patterns for production config: per-type best practices, manifest files, process interrupts, and adapter toggles."
---

DA's config system is flexible, but that flexibility means there's always a question of which type to use and how to structure entries. This guide covers patterns that emerge from real production applications.

For the full type reference, see [Config Types](../reference/config/types.mdx). For source priority and the env variable format, see [Config and Environments](./config-and-environment.md).

## Per-type use cases

### string — URLs, names, connection strings

Most config entries are `string`. Use it for anything that's a URL, a connection string, a service name, or a path.

```typescript
DATABASE_URL: { type: "string", required: true },
SERVICE_NAME: { type: "string", default: "my-service" },
CACHE_URL: { type: "string" },
```

### string + required, no default — secrets that must exist

A `required: true` entry with no `default` forces the value to come from the environment. The application won't boot if it's missing:

```typescript
API_KEY:    { type: "string", required: true },
JWT_SECRET: { type: "string", required: true },
```

The boot failure is clear: `REQUIRED_CONFIGURATION_MISSING` with the module and key name. This is better than a runtime `undefined` deep inside a service.

### string + source: ["env"] — secrets that must never be in a file

`source` restricts which loaders can provide a value. Use `["env"]` for secrets that should never appear in a config file committed to version control:

```typescript
SECRET_KEY: {
  type: "string",
  required: true,
  source: ["env"],  // env variable only; ignored if set via file or argv
},
```

Combine with `required: true` to get an error if the env variable is missing rather than silently running without the secret.

### number — limits, timeouts, ports

Use `number` for tunable values that operations teams might want to adjust without a code change:

```typescript
PORT:                { type: "number", default: 3000 },
CONNECTION_POOL_SIZE: { type: "number", default: 10 },
REQUEST_TIMEOUT_MS:   { type: "number", default: 5000 },
MAX_RETRY_ATTEMPTS:   { type: "number", default: 3 },
```

### boolean — feature flags and capability toggles

Use `boolean` for things that are on or off. Default to `true` or `false` depending on whether the feature should be on by default.

```typescript
ENABLE_METRICS:  { type: "boolean", default: true },
CACHE_ENABLED:   { type: "boolean", default: true },
DEBUG_RESPONSES: { type: "boolean", default: false },
```

Environment variable format: `MY_APP__ENABLE_METRICS=false` (the string `"false"` is coerced to the boolean `false`).

### boolean for process interrupts

A `boolean` with no `default` works well for one-off process modes — flags you set explicitly to trigger a specific behavior:

```typescript
VALIDATE_CONFIG: { type: "boolean" },  // default undefined → falsy
DRY_RUN:         { type: "boolean" },
```

These are never `true` in normal operation. Set them via environment variable or `bootstrap.configuration` to activate the behavior.

For the full validate-config pattern, see [Platform Entrypoints](../advanced/platform-entrypoints.md).

### string[] — lists of values

Use `string[]` for lists of identifiers, origins, or names:

```typescript
ENABLED_BACKENDS: {
  type: "string[]",
  default: ["backend_a"],
},
ALLOWED_ORIGINS: {
  type: "string[]",
  default: [],
},
```

Environment variable format: comma-separated string — `MY_APP__ENABLED_BACKENDS=backend_a,backend_b`.

### record — key-value maps

`record` stores a `Record<string, string>` — free-form key-value data. Use it for label sets, metadata maps, or feature flag dictionaries that you don't want to declare as individual entries:

```typescript
FEATURE_FLAGS: {
  type: "record",
  default: {},
},
DEPLOYMENT_LABELS: {
  type: "record",
  default: {},
},
```

### internal — framework-managed values

The `internal` type is for values managed by the framework itself, not user configuration. You won't use this type in application code. The canonical example is `boilerplate.CONFIG`, which points to the config file path and can only be set via `source: ["argv"]`.

---

## The manifest file pattern

In containerized or CI/CD deployments, it's useful to separate secrets (which ops/security controls) from deployment metadata (which infrastructure tooling generates). The manifest file pattern handles this split cleanly.

Infrastructure tooling — a CI pipeline, an IaC tool, a deployment system — writes a `.manifest.yaml` to the application's working directory at deploy time. It contains non-secret metadata:

```yaml title=".manifest.yaml"
boilerplate:
  LOG_LEVEL: info
my_app:
  ENVIRONMENT: production
  SERVICE_NAME: my-api
  REGION: us-east-1
  FEATURE_FLAGS:
    new_checkout_flow: "true"
```

The application auto-detects and loads it by setting `boilerplate.CONFIG`:

```typescript
import { existsSync } from "node:fs";

if (existsSync(".manifest.yaml")) {
  options.configuration ??= {};
  options.configuration.boilerplate ??= {};
  options.configuration.boilerplate.CONFIG = ".manifest.yaml";
}
```

`boilerplate.CONFIG` is the path to the config file. When set, it overrides the framework's default file discovery (which looks for `.env`). The file can be YAML, JSON, or `.env` format.

Secrets never go in the manifest. They live in environment variables (or a remote secrets loader — see [Custom Config Loaders](../tutorials/09-custom-config-loader.md)).

**Rule of thumb:**
- Infrastructure generates it → manifest file
- Ops/security controls it → environment variable
- Changes at runtime without a redeploy → remote loader

This pattern is most useful when many services share the same deployment toolchain. Each service gets its own manifest generated at deploy time; the bootstrap wrapper auto-loads it.

---

## The adapter enable/disable pattern

When an application bundles multiple optional backends, use a `boolean` config entry per adapter to control which ones are active in a given environment:

```typescript title="src/libraries/provider-a/index.mts"
export const LIB_PROVIDER_A = CreateLibrary({
  name: "provider_a",
  configuration: {
    IS_ACTIVE: { type: "boolean", default: true },
    API_URL:   { type: "string", required: true },
    API_KEY:   { type: "string", required: true, source: ["env"] },
  },
  // ...
});
```

The adapter's service checks `IS_ACTIVE` before doing anything:

```typescript
export function ProviderAService({ config, registry }: TServiceParams) {
  if (!config.provider_a.IS_ACTIVE) return;  // skip registration in this environment

  registry.registry.register({
    name: "provider_a",
    // ...
  });
}
```

In a dev environment where only one backend is needed:

```bash
PROVIDER_B__IS_ACTIVE=false
PROVIDER_C__IS_ACTIVE=false
```

The libraries are still wired and their config still loads — which means `required: true` entries for inactive adapters will still fail at boot if not provided. Handle this by not marking API keys as `required` when the adapter might be inactive, or by guarding:

```typescript
API_KEY: {
  type: "string",
  // Don't use required: true here — the adapter might be IS_ACTIVE: false
},
```

This gives you a single deployment image that runs correctly in any environment, selectively enabling backends via configuration alone.

For the full plugin/adapter registry pattern, see the [Building a Plugin Registry](/blog/building-a-plugin-registry) blog post.
