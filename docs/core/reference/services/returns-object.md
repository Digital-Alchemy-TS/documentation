---
title: Object Return
sidebar_position: 3
description: "Returning an object from a service: methods, state, and the getter pattern."
---

Returning an object from a service exposes multiple methods or properties as the service's public API. It's the most common return pattern.

## Basic example

```typescript
export function RegistryService({ }: TServiceParams) {
  const items = new Map<string, unknown>();

  return {
    add:    (id: string, item: unknown) => items.set(id, item),
    remove: (id: string) => items.delete(id),
    get:    (id: string) => items.get(id),
    list:   () => [...items.values()],
    get size() { return items.size; },
  };
}
```

Other services access it as `my_app.registry.add(...)`, `my_app.registry.size`, etc.

## Type inference

TypeScript infers the return type automatically from the returned object literal. No explicit annotation is needed:

```typescript
// TypeScript infers ReturnType<typeof RegistryService> as:
// { add: (id: string, item: unknown) => void; remove: ...; get: ...; list: ...; size: number }
```

## The getter pattern

Properties on a plain return object are evaluated once when the object is created. If you expose internal state directly:

```typescript
return { count: internalCount }; // snapshot — won't update
```

The value is captured at wiring time. If `internalCount` changes later, callers still see the original value.

Use a **getter** to expose live state:

```typescript
export function CounterService({ }: TServiceParams) {
  let count = 0;

  return {
    increment: () => { count++; },
    decrement: () => { count--; },
    get value() { return count; },  // live — evaluated on every access
  };
}
```

`my_app.counter.value` always reflects the current internal count. TypeScript infers the getter's return type as `number` automatically.

**Use getters for:**
- Connection state (`get connected() { return !!socket; }`)
- Counters and accumulators
- Feature flags that can change at runtime
- Any property that changes after wiring

## Methods that return internal state

Alternatively, expose a method:

```typescript
return {
  getCount: () => count,  // same effect as a getter
};
```

Methods are slightly more explicit but syntactically heavier at call sites (`my_app.counter.getCount()` vs `my_app.counter.count`). Use whichever reads more naturally for the consumer.

## Mixing methods and getters

Both can coexist freely:

```typescript
export function ConnectionService({ lifecycle }: TServiceParams) {
  let connected = false;
  let socket: Socket | undefined;

  lifecycle.onBootstrap(async () => {
    socket = await connect();
    connected = true;
  });

  lifecycle.onShutdownStart(async () => {
    await socket?.close();
    connected = false;
  });

  return {
    get connected() { return connected; },
    send: (data: Buffer) => socket?.write(data),
    query: async (req: Request) => socket?.request(req),
  };
}
```
