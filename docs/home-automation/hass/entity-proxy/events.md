---
title: Events
id: hass-entity-proxy-events
sidebar_position: 1
---

Entity Proxies have several utilities for listening to and filtering events events.


The most common way of attaching to events is via the `.onUpdate` hook.
These run in response to entities emitting changes to their state or attributes via the socket

```typescript
// ⚠️ either param may be null for operations like entity add / remove
mySwitch.onUpdate((new_state, old_state) => {
  if (old_state?.state === "on" && new_state?.state === "off") {
    // perform action
  }
});
```

### Removable

Some workflows work best with shorter term or more precise listeners. A basic `onUpdate` can be removed like by 2 methods:

1. return value

```typescript
const { remove } = mySwitch.onUpdate(callback);
remove()
```

2. remover in params

```typescript
mySensor.onUpdate(function (new_state, old_state, remove) {
  remove();
});
```

A few related methods are also provided:

- `entity.waitForState(target_state, [timeout_ms])`: resolves promise when entity state changes to provided value
- `entity.nextState([timeout_ms])`: wait for a state change (ignores updates that doesn't change state)
- `entity.once`: same as onUpdate, but only runs once
