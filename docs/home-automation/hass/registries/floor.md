---
title: Floor
id: hass-floor
sidebar_position: 1
---

The `floor` registry reflects Home Assistant floors. These act as a grouping utility for `areas`

## Service Interactions

| public property | description                                       |
| --------------- | ------------------------------------------------- |
| `create`        | Creates a new floor in home assitant               |
| `current`       | Current array of known floors                      |
| `delete`        | Remove an floor from home assistant                |
| `list`          | Request a fresh list of floors from home assistant |
| `update`        | Modify an existing floor                           |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TFloorId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickAFloor(floor_id: TFloorId) {
      //
    },
  };
}
```
