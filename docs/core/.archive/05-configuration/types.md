---
title: Config Types
sidebar_position: 3
description: "All supported configuration types in Digital Alchemy Core."
---

## string

Plain string value. Optionally restricted to a set of allowed values with `enum`.

```typescript
CACHE_PROVIDER: { type: "string", default: "memory" }

// With enum — TypeScript narrows to a union
LOG_FORMAT: {
  type: "string",
  enum: ["json", "pretty"],
  default: "pretty",
} as StringConfig<"json" | "pretty">
```

The `as StringConfig<"json" | "pretty">` cast is needed to propagate the union type to `config.my_lib.LOG_FORMAT`. Without it, the type is inferred as `string`.

## number

Numeric value. Accepts integers and floats.

```typescript
PORT:       { type: "number", default: 3000 }
BATCH_SIZE: { type: "number", default: 100, required: true }
```

When sourced from environment variables or CLI, the string is cast to a number. Non-numeric values are treated as `NaN`.

## boolean

```typescript
FEATURE_FLAG: { type: "boolean", default: false }
```

From environment variables: `"true"`, `"1"`, `"yes"` → `true`; anything else → `false`.

From CLI: passing `--FEATURE_FLAG` (no value) is treated as `true`.

## string[]

Array of strings. When sourced from environment variables, the value is split on commas.

```typescript
ALLOWED_ORIGINS: {
  type: "string[]",
  default: ["http://localhost:3000"],
}
// ALLOWED_ORIGINS=http://a.com,http://b.com → ["http://a.com", "http://b.com"]
```

## record

A `Record<string, string>` — key/value pairs of strings. Useful for arbitrary maps like HTTP headers or tag sets.

```typescript
DEFAULT_HEADERS: {
  type: "record",
  default: { "X-Source": "my-app" },
}
```

From environment variables or CLI, format is `key=value,key2=value2`.
