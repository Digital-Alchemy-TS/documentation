---
title: Event Bus
sidebar_position: 4
description: "App-wide EventEmitter, typed events, and error event constants."
---

`event` on `TServiceParams` is a Node.js `EventEmitter` shared across all services in the application. It's the same instance in every service — emitting in one service is received in all others.

## Basics

```typescript
export function UserService({ event, lifecycle }: TServiceParams) {
  // Register a listener
  event.on("user:created", (user: { id: string; name: string }) => {
    logger.info({ user }, "user created");
  });

  // Emit an event
  const createUser = (name: string) => {
    const user = { id: crypto.randomUUID(), name };
    event.emit("user:created", user);
    return user;
  };

  return { createUser };
}
```

The `EventEmitter` API is Node's standard `node:events` interface. All methods work as documented in the Node.js docs.

## Lifecycle

The event emitter is created fresh at each `bootstrap()` call and destroyed (`.removeAllListeners()`) at `teardown()`. This ensures test isolation — no listeners leak between test runs.

## Typed events

TypeScript doesn't know the type of event payloads by default. The idiomatic pattern is to define event type maps and cast when emitting/receiving:

```typescript
// Define types in a shared types file
type AppEvents = {
  "user:created": { id: string; name: string };
  "order:placed": { orderId: string; total: number };
};

// Emit with type assertion
event.emit("user:created", { id: "123", name: "Alice" } satisfies AppEvents["user:created"]);

// Receive with cast
event.on("user:created", (payload: AppEvents["user:created"]) => {
  // payload is typed
});
```

For more thorough typing, you can use declaration merging (similar to `LoadedModules`) to extend a custom interface, or use a typed EventEmitter wrapper library.

## Error events

The framework defines three error event constants for framework-level error signaling:

| Constant | Value | When emitted |
|---|---|---|
| `DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR` | `"DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR"` | Uncaught exceptions (when `handleGlobalErrors: true`) |
| `DIGITAL_ALCHEMY_APPLICATION_ERROR` | `"DIGITAL_ALCHEMY_APPLICATION_ERROR"` | Application-level errors |
| `DIGITAL_ALCHEMY_LIBRARY_ERROR(lib?)` | `"DIGITAL_ALCHEMY_LIBRARY_ERROR"` or `"DIGITAL_ALCHEMY_LIBRARY_ERROR:libname"` | Library-level errors |

```typescript
import {
  DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR,
  DIGITAL_ALCHEMY_LIBRARY_ERROR,
} from "@digital-alchemy/core";

event.on(DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR, (error: Error) => {
  // Log to external system before shutdown
  errorTracker.capture(error);
});

event.on(DIGITAL_ALCHEMY_LIBRARY_ERROR("my_lib"), (error: Error) => {
  // Handle library-specific errors
});
```

## Best practices

Register listeners in the service function body, not inside lifecycle callbacks. The event emitter is available during wiring, and you want listeners registered before the `Ready` stage in case events fire during `Bootstrap`.

```typescript
export function ListenerService({ event }: TServiceParams) {
  // ✅ Register at wiring time — listeners are in place for all lifecycle stages
  event.on("important:event", handleEvent);

  // ❌ Don't register in lifecycle callbacks unless you have a specific reason
  // lifecycle.onReady(() => { event.on("event", handler); }); // too late
}
```
