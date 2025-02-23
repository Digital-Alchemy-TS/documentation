---
title: "💼 Locals"
authors: [zoe-codez]
sidebar_position: 5
---

In addition to acting as entities for Home Assistant, `synapse` entities have the ability to store generic data locally.
Data gets serialized and placed in the same sqlite database that maintains current state for your application.

Updates to `locals` persist across boots of your application, and modifications do not trigger update events.
The system operates the same way for all entity domains.

## 🚀 Creation

Working with locals has 3 elements to keep in mind:

1. type definitions
2. default values
3. runtime values

Data is tracked by entity `unique_id` and property name, with the internals handling value resolution and storage.

### ✏️ Defining types

In order to keep typescript happy, you must **explicitly** provide type definitions for your locals for.
Typescript will not infer these values properly for normal operations.

> inline definition

```typescript
synapse.sensor<{
  locals: {
    offlineSince?: number;
    operation: "idle" | "running" | "error";
  };
}>({ ... });
```

> separate type

```typescript
type SensorLocals = {
  offlineSince?: number;
  operation: "idle" | "running" | "error";
};

synapse.sensor<{ locals: SensorLocals }>({ ... });
```

### ⚙️ Defaults & value resolution

You are able to provide defaults for fields to alter the way resolution works.

If a field has not have a runtime value provided, the system will attempt to source from the defaults.

#### Defaults & resetting

For example, with

```typescript
const sensor = synapse.sensor<{ locals: SensorLocals }>({
  locals: { operation: "idle" },
});
// current state
sensor.locals.offlineSince === undefined;
sensor.locals.operation === "idle";
```

Once set, values will be persisted returned as expected.

```typescript
sensor.locals.offlineSince = Date.now();
sensor.locals.operation = "error";
```

The `delete` operator can be used to clear the current value from a specific field.

```typescript
delete sensor.locals.offlineSince;
// returns to undefined

delete sensor.locals.operation;
// returns to "idle"
```

## 🪇 Supported operations

### ownKeys

`Object.keys` will return the list of keys with values + those available through defaults

```typescript
const allLocals = Object.keys(sensor.locals);
```

### has

Sources from the same list as `ownKeys` to allow operations that check for presence of properties.

```typescript
if ("operation" in sensor.locals) {
  // ✅ gates as expected
}
```

### set & reset

As shown above, individual keys can be set / reset as needed. The same concept applies to the `locals` object as a whole.
The `delete` operator can be used directly on `locals` to reset to defaults.

```typescript
delete sensor.locals;
```

This can also be done via assignment:

```typescript
sensor.locals = {};
```

The assignment operator can be used for code efficient batch updates

```typescript
// clears offlineSince if present
sensor.locals = { operation: "running" };
```
