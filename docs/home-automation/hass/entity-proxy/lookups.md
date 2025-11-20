---
title: Lookups
id: hass-entity-proxy-lookups
sidebar_position: 2
---

The most common method of creating references is using `hass.refBy.id`:

```typescript
import { TServiceParams } from "@digital-alchemy/hass";

export function ExampleService({ hass }: TServiceParams) {
  const mySensor = hass.refBy.id("sensor.my_special_sensor");
  // that's it!
}
```

The `hass.refBy` also allows for lookups against `area`, `device`, `label`, `floor`, `platform`, and `unique_id` to create an array of references.

```typescript
// simple lookup, returns array of references
hass.refBy.area("living_room");
// limit by domain(s)
hass.refBy.floor("downstairs", "light", "switch");
// lookup by unique ID
hass.refBy.unique_id("unique_sensor_id");
```
