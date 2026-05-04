---
title: priorityInit
sidebar_position: 5
description: "Controlling wiring order within a module — priorityInit and the wireOrder algorithm."
---

By default, services within a module wire in the order they appear in the `services` object. If a service's top-level code (outside any lifecycle callback) needs another service's return value, the dependency must be wired first. `priorityInit` declares that order explicitly.

## Usage

```typescript
CreateApplication({
  name: "my_app",
  priorityInit: ["database", "cache"],  // wire these first, in this order
  services: {
    cache:    CacheService,    // ← wires second
    database: DatabaseService, // ← wires first
    api:      ApiService,      // ← wires after database and cache
    worker:   WorkerService,   // ← wires after api
  },
});
```

Services named in `priorityInit` wire first, in listed order. All remaining services wire after, in their declaration order.

## The wireOrder algorithm

`wireOrder(priority, allServices)` produces the final wiring sequence:

1. Start with `priority` (in order)
2. Append any service in `allServices` not already in `priority`
3. Wire the combined list serially (one at a time, awaiting each)

This means `priorityInit` is purely additive — it doesn't remove any services, it just puts specific ones first.

## When to use it

`priorityInit` is needed when a service accesses another service's return value at the **top level** of its function (during wiring), not inside a lifecycle callback:

```typescript
// ❌ Can break if cache isn't wired yet
export function ApiService({ my_app }: TServiceParams) {
  const pool = my_app.database.createPool();  // top-level — runs during wiring
}

// ✅ Fix: declare database in priorityInit
CreateApplication({
  priorityInit: ["database"],
  services: { database: DatabaseService, api: ApiService },
});

// ✅ Alternative fix: move the call inside a lifecycle callback
export function ApiService({ my_app, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    const pool = my_app.database.createPool();  // safe — all services wired
  });
}
```

## Limitations

`priorityInit` only controls order *within* a module. It cannot make a library service wire before your application service. For cross-module ordering, use `depends` / `libraries` in `CreateLibrary`.

## Error: DOUBLE_PRIORITY

If `priorityInit` contains the same service name more than once, `wireOrder` throws `DOUBLE_PRIORITY` immediately:

```typescript
priorityInit: ["database", "cache", "database"] // ← DOUBLE_PRIORITY
```

## Error: MISSING_PRIORITY_SERVICE

If a name in `priorityInit` doesn't exist in `services`, `CreateApplication` throws `MISSING_PRIORITY_SERVICE` at construction time (before bootstrap):

```typescript
priorityInit: ["database"],
services: { db: DatabaseService } // ← "database" not in services → MISSING_PRIORITY_SERVICE
```
