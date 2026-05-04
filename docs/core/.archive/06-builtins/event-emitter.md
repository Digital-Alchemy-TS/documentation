---
title: Event Emitter
sidebar_position: 4
description: "Application-wide EventEmitter for cross-service pub/sub in Digital Alchemy Core."
---

`event` on `TServiceParams` is a Node.js `EventEmitter` shared across every service in the application. It provides a decoupled pub/sub channel for cross-service communication.

## Usage

```typescript
export function PublisherService({ event }: TServiceParams) {
  lifecycle.onReady(() => {
    event.emit("my_app:data_loaded", { count: 42 });
  });
}

export function SubscriberService({ event, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    event.on("my_app:data_loaded", ({ count }) => {
      logger.info({ count }, "data loaded");
    });
  });
}
```

Register listeners in a lifecycle callback (not at the top level of your service function) so cleanup at teardown works correctly.

## Lifecycle

- The event emitter is **created fresh** at each bootstrap
- `setMaxListeners(0)` is called automatically — no listener count warnings
- The emitter is **cleaned up** at teardown — any listeners registered outside a lifecycle callback may behave unexpectedly on re-bootstrap (in tests)

## Framework error events

The framework emits specific events for unhandled errors:

| Event | When |
|---|---|
| `DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR` | Unhandled promise rejection or uncaught exception |
| `DIGITAL_ALCHEMY_APPLICATION_ERROR` | Error thrown by the application module |
| `DIGITAL_ALCHEMY_LIBRARY_ERROR` | Error thrown by a specific library (event name includes `:libraryName`) |

```typescript
import { DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR } from "@digital-alchemy/core";

event.on(DIGITAL_ALCHEMY_NODE_GLOBAL_ERROR, (error) => {
  externalMonitoring.capture(error);
});
```

## Naming conventions

Use namespaced event names to avoid collisions between modules: `module_name:event_name`. For example:

```typescript
event.emit("hass:state_changed", { entity_id, new_state });
event.emit("synapse:entity_registered", { id, domain });
event.emit("my_app:job_complete", { jobId, result });
```
