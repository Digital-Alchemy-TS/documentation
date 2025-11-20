---
title: Zone
id: hass-zone
sidebar_position: 1
---

The `zone` registry reflects Home Assistant zones.

## Service Interactions

| public property | description                                       |
| --------------- | ------------------------------------------------- |
| `create`        | Creates a new zone in home assitant               |
| `current`       | Current array of known zones                      |
| `list`          | Request a fresh list of zones from home assistant |
| `update`        | Modify an existing zone                           |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TZoneId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickAZone(zone_id: TZoneId) {
      //
    },
  };
}
```
