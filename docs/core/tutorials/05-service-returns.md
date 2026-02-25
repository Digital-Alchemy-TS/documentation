---
title: Service Returns
sidebar_position: 6
description: "Object vs function return patterns, the getter pattern, and void services."
---

A service function can return three things: an object, a function, or nothing. The choice determines how other services call it.

## Object return

Return an object when the service exposes multiple methods or properties. This is the most common pattern.

```typescript
export function RegistryService({ }: TServiceParams) {
  const items = new Map<string, unknown>();

  return {
    add:    (id: string, item: unknown) => items.set(id, item),
    remove: (id: string) => items.delete(id),
    get:    (id: string) => items.get(id),
    list:   () => [...items.values()],
  };
}
```

Other services call it as `my_app.registry.add(...)`, `my_app.registry.list()`, etc.

### The getter pattern

Properties on the return object are evaluated once at wiring time. If you expose a property directly:

```typescript
return { count: internalCount }; // snapshot — won't update
```

The value is captured at the moment the object is created. If `internalCount` changes later, callers still see the original value.

Use a **getter** instead to expose live state:

```typescript
export function CounterService({ }: TServiceParams) {
  let count = 0;

  return {
    increment: () => { count++; },
    decrement: () => { count--; },
    get value() { return count; },  // ← live, always current
  };
}
```

The getter is evaluated on every access, so `my_app.counter.value` always reflects the current internal state. TypeScript infers the getter's return type automatically — no annotation needed.

Use getters for: connection state, current counts, feature flags, any value that changes after wiring.

## Function return

Return a function when the service's primary interface is a single callable — typically a factory, builder, or context-scoped helper.

```typescript
export function LoggerFactoryService({ }: TServiceParams) {
  return (namespace: string) => ({
    info: (msg: string) => console.log(`[${namespace}] ${msg}`),
    error: (msg: string) => console.error(`[${namespace}] ${msg}`),
  });
}
```

Other services call it as `my_app.loggerFactory("payments").info("...")`.

This pattern works well for anything that takes a configuration argument and returns a specialized tool — entity builders, client factories, context-scoped loggers.

## Void return (side-effect-only)

A service doesn't have to return anything. If the service's job is to register listeners, set up timers, or perform one-time side effects, a void return is fine.

```typescript
export function MetricsCollectorService({ lifecycle, scheduler }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    // Register event listeners, set up instrumentation
  });

  scheduler.setInterval(() => {
    // Collect and flush metrics every 30 seconds
  }, "30s");

  // No return — other services don't call this one
}
```

There's no type error for omitting a return. TypeScript treats void services correctly; `my_app.metricsCollector` will have type `void`, which is just not callable.

## Choosing a pattern

| Pattern | Use when |
|---|---|
| Object return | Multiple methods or readable state |
| Getter on object return | Exposing internal state that changes over time |
| Function return | Single callable; factory or builder |
| Void return | Side effects only; no public API needed |

Next: [Building a Library →](./06-building-a-library.md)
