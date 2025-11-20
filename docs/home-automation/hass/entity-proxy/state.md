---
title: States
id: hass-entity-proxy-states
---

Entity proxies provide a variety of tools for interacting with state, always having logic updated to reflect current point in time.

## state

The type definition for `state` provided to any particular entity is set up to reflect the value in Home Assistant.
Some domains, like `binary_sensor`, may feature string unions instead of simple primitives.

```typescript
import { TServiceparams } from "@digital-alchemy/core";

export function EntityStates({ hass, lifecycle, logger }: TServiceParams) {
  const mySensor = hass.refBy.id("sensor.outdoor_temperature");
  lifecycle.onReady(() => {
    logger.info("current outdoor temperature is %s", mySensor.state);
  });

  mySensor.onUpdate(new_state => {
    // new_state.state === mySensor.state
    // both are valid and refer to the same thing
    logger.info("current outdoor temperature is now %s", mySensor.state);
  });
}
```

### assignments

Assignments to the `state` property are possible, with a special call being made to attempt to set the state.

This relies on some quirks within Home Assistant to work right, and may not always do what you think it should.
You should seek to use proper service calls to set state when possible.

## attributes

Like state, the entity `attributes` are always available on demand (and do have assignment support).

```typescript
logger.info("friendly_name = %s", mySensor.attributes.friendly_name);
```

## previous

The `previous` property provides a simple path to accessing the immediate previous state / attributes of the entity from any workflow.

```typescript
mySensor.onUpdate((new_state, old_state) => {
  // Both of these are equivalent
  // old_state.state === mySensor.previous.state
});
```

## history

If you need more than just the current / previous state, entities expose a history querying function
Access historical state changes for an entity:

```typescript
const now = dayjs();
const from = now.substract(1, "day");

// Get history for the last 24 hours
const history = await mySensor.history(from, now);
```

## `last_changed` / `last_*`

Entities also expose a few readonly timestamps for tracking:

- `last_changed`
- `last_reported`
- `last_updated`
