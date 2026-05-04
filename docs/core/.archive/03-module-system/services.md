---
title: Services
sidebar_position: 4
description: "The service function pattern, return types, and initialization order."
---

A service is a plain TypeScript function registered in a module. The framework calls it once during wiring, passes it `TServiceParams`, and uses its return value as the module's API.

## The function pattern

```typescript
import type { TServiceParams } from "@digital-alchemy/core";

export function MyService({ logger, lifecycle, config }: TServiceParams) {
  // Code here runs during wiring
  const state = new Map<string, unknown>();

  lifecycle.onReady(() => {
    logger.info("MyService ready");
  });

  // Return value becomes the service's API
  return {
    get: (key: string) => state.get(key),
    set: (key: string, value: unknown) => state.set(key, value),
    state,
  };
}
```

## Return shapes

Services can return an **object** or a **function**. Both patterns are supported; choose based on what you're exposing.

### Object return

Best when a service exposes multiple methods or properties:

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

### Function return

Best when the service's primary interface is a single callable — often a factory or builder:

```typescript
export function LoggerService({ }: TServiceParams) {
  return (namespace: string) => {
    return {
      log: (message: string) => console.log(`[${namespace}] ${message}`),
    };
  };
}
```

Other services call it as `my_app.log_svc("payments").log("...")`.

## Accessing other services

Services reference other services through `TServiceParams`. The key is the module name, not the service name:

```typescript
export function ConsumerService({ my_lib, my_app }: TServiceParams) {
  // my_lib is the full API of MY_LIB
  const data = my_lib.api.get("/items");

  // my_app is the app's own services (other than the current one)
  my_app.registry.add("item", data);
}
```

:::caution Wiring order matters
If you access another service's return value at the top level of your function (not inside a lifecycle callback), that service must already be wired. Use `priorityInit` to force a specific service to wire first, or move the call into `lifecycle.onPreInit()` or later.
:::

## priorityInit

By default, services within a module wire in the order they appear in the `services` object. If service A needs service B's return value during wiring, declare B in `priorityInit`:

```typescript
CreateApplication({
  name: "my_app",
  priorityInit: ["registry", "cache"],  // These wire first, in this order
  services: {
    cache:    CacheService,
    registry: RegistryService,
    api:      ApiService,       // Wires after registry and cache
    worker:   WorkerService,    // Wires after api
  },
});
```

`priorityInit` only controls ordering *within* a module. Cross-module ordering is handled by `depends`/`libraries`.
