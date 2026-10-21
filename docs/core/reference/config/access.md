---
title: Accessing Config
sidebar_position: 4
description: "Read final configuration values, understand construction previews, and restrict loader sources."
---

## Reading config values

Config is injected on `TServiceParams`. Each module's entries live under its module name:

```typescript
export function MyService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    const url = config.my_app.DATABASE_URL; // string
    const port = config.my_app.PORT; // number
    const env = config.my_app.ENVIRONMENT; // provider output type
    logger.info({ url, port, env }, "config ready");
  });
}
```

TypeScript derives each key from its declaration. A schema transform or codec can make the injected output type differ from the input accepted by bootstrap and loaders.

## When values are available

Configuration has a construction preview and a finalized phase:

1. **Construction and `PreInit`:** Services are wired before external loaders run. Legacy defaults are visible. An explicit TypeBox root default may also be available, with an isolated clone; a known bootstrap value may replace that preview. Raw bootstrap and loader values can be visible to later loaders, but they are not guaranteed to be processed output. Nested TypeBox defaults/effects and Zod or opaque Standard Schema defaults are finalization-only.
2. **After `PostConfig`:** Environment/argv, the optional file loader, and registered custom loaders have settled. Core has processed schemas and published the complete output snapshot. This is the first point where final `config.*` values are guaranteed.

Read configuration in `onPostConfig` or a later hook:

```typescript
export function ApiService({ config, lifecycle }: TServiceParams) {
  // Do not make final-value decisions in the service factory.
  lifecycle.onPostConfig(() => {
    const url = config.my_app.DATABASE_URL;
    startClient(url);
  });
}
```

If a schema provider rejects the winning value, `onPostConfig` callbacks do not run and no partial processed snapshot is published.

## Legacy `required: true`

`required` belongs only to legacy `type` entries:

```typescript
DATABASE_URL: {
  type: "string",
  required: true,
}
```

A missing legacy value throws `REQUIRED_CONFIGURATION_MISSING` during finalization. A legacy default satisfies `required: true`.

Schema entries express presence through native provider constructs instead:

```typescript
API_KEY: { schema: Type.String() },
OPTIONAL_LABEL: { schema: Type.Optional(Type.String()) },
```

A missing bare schema currently fails with `CONFIG_SCHEMA_INVALID`; there is no `CONFIG_SCHEMA_REQUIRED` diagnostic. Optional schemas preserve the provider's undefined behavior, and an optional schema with a native default uses that default.

## Source restriction

The `source` property restricts which loaders can set an entry:

```typescript
SECRET_KEY: {
  schema: Type.String(),
  source: ["env"],
}
```

A loader whose name is not allowed is ignored for that key. `source` filters loader output only; it does not block an explicit `bootstrap({ configuration })` seed or output-shaped values supplied through the public `set()` and `merge()` APIs.

## Read-only injected config

The injected `config` proxy is read-only. Mutating a returned namespace does not persist:

```typescript
config.my_app.PORT = 9000; // not a supported update
```

For a programmatic update, use the internal configuration service:

```typescript
internal.boilerplate.configuration.set("my_app", "PORT", 9000);
```

`set()` and `merge()` accept output-shaped values and emit/update the live store without running schema decoding or validation again. A transform or codec therefore must be given its already-decoded output type at this boundary.

See [Schema-backed Configuration](./schemas.mdx#input-and-output-types) for the input/output distinction and [Config Sourcing](./sourcing.md) for loader order.
