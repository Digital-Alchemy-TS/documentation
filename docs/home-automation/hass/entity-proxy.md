---
title: "🎭 Entity Proxies"
sidebar_position: 2
authors: [zoe-codez]
---

Entity proxies are references to specific entities, which allow for a variety of operations to be performed:

- read current attributes / state
- listen for state changes
- issue targeted service calls

## Creating references

The most common method of creating references is using `hass.refBy.id`:

```typescript
import { TServiceParams } from "@digital-alchemy/hass";

export function ExampleService({ hass }: TServiceParams) {
  const mySensor = hass.refBy.id("sensor.my_special_sensor");
  // that's it!
}
```

The `hass.refBy` also allows for lookups against `area`, `device`, `label`, `floor`, and `platform` to create an array of references.

```typescript
// simple lookup, returns array of references
hass.refBy.area("living_room");
// limit by domain(s)
hass.refBy.floor("downstairs", "light", "switch");
```

## State lookups

The most common way to access state is via the `.state` & `.attributes` properties.

```typescript
const mySwitch = hass.refBy.id("switch.example");
logger.info(`current state is ${mySwitch.state}`); // on
```

These perform lookups against an internal entity state registry within `hass` to retrieve the current value at that moment.
You may also perform lookups against the immediately previous state

```typescript
logger.info(`previous state was ${mySwitch.previous.state}`);
```

> **Note**: internal registry state changes are performed before emitting update events

## Event Hooks

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

## Service Calls

The final ability of entity references is to issue targeted service calls.
These are a convenience for when the service call's domain is the same as the entity.

```typescript
hass.refBy.id("light.office").turn_on()
// same as
hass.call.switch.turn_on({ entity_id: ["light.office"] });
```
![entity service call](/img/entity_service_call.png)
