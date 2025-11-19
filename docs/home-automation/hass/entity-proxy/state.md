---
title: States
id: hass-entity-proxy-states
---

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

## Modifying Entity State

Entity proxies support direct modification of state and attributes:

```typescript
const myEntity = hass.refBy.id("sensor.temperature");

// Set state directly
myEntity.state = 72;

// Update attributes
myEntity.attributes = {
  unit_of_measurement: "°F",
  friendly_name: "Living Room Temp"
};
```

> **Note**: State modifications are sent via REST API and may not be supported by all entity types

## Historical Data

Access historical state changes for an entity:

```typescript
const mySensor = hass.refBy.id("sensor.outdoor_temperature");

// Get history for the last 24 hours
const history = await mySensor.history(
  dayjs().subtract(24, 'hours'),
  dayjs()
);

// history contains array of { state, attributes, date } objects
```
