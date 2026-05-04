---
title: Accessing Config
sidebar_position: 4
description: "Reading config values, timing, required entries, and the source property."
---

## Reading config values

Config is accessed through `config` on `TServiceParams`. Each module's entries live under their module name:

```typescript
export function MyService({ config }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    const url  = config.my_app.DATABASE_URL;  // string
    const port = config.my_app.PORT;          // number
    const env  = config.my_app.ENVIRONMENT;   // "local" | "staging" | "production"
  });
}
```

TypeScript infers the type of each key from the config entry declaration. No annotation needed.

## When values are available

Config goes through two phases:

1. **At wiring time:** Only `default` values are available. External sources (env, argv, file) have not been applied yet.
2. **After `PostConfig`:** All sources merged, `required` entries validated. This is the correct time to read config.

```typescript
export function MyService({ config, lifecycle }: TServiceParams) {
  // ❌ Wrong: wiring time — only defaults, may be wrong or undefined
  const url = config.my_app.DATABASE_URL;

  // ✅ Correct: PostConfig — all sources applied, validated
  lifecycle.onPostConfig(() => {
    const url = config.my_app.DATABASE_URL;
  });
}
```

Reading in `onBootstrap` or `onReady` is also fine — they run after `PostConfig`.

## required: true

A `required: true` entry with no value causes bootstrap to throw `REQUIRED_CONFIGURATION_MISSING` during the `PostConfig` stage — before any `onPostConfig` callbacks run. The error message includes the full dotted path to the missing config entry.

```typescript
DATABASE_URL: {
  type: "string",
  required: true,  // no default — bootstrap fails if not set from an external source
}
```

This is the idiomatic way to handle secrets: fail loudly at boot time rather than getting a confusing runtime error when the service first tries to use the missing value.

## Combining required and default

A `default` value satisfies `required: true`. The entry is only "missing" if both the default and all external sources fail to provide a value:

```typescript
LOG_LEVEL: {
  type: "string",
  enum: ["debug", "info", "warn", "error"] as const,
  default: "info",
  required: true,  // always satisfied — default ensures a value exists
}
```

This pattern is useful when you want to guarantee a non-undefined value in TypeScript but still want to allow override from the environment.

## source restriction

The `source` property restricts which loaders can set a config entry:

```typescript
SECRET_KEY: {
  type: "string",
  required: true,
  source: ["env"],  // only settable via environment variable, not argv or file
}
```

If a loader that isn't in the `source` array tries to set the value, it's silently ignored. The value remains at its default or whatever a permitted source set.

## config is read-only from services

`config` is a Proxy that returns copies of config namespaces. Modifying `config.my_app.PORT` does nothing — the change doesn't persist. To modify config programmatically, use `internal.boilerplate.configuration.set(project, property, value)`. See [Config Sourcing](./sourcing.md#programmatic-updates).
