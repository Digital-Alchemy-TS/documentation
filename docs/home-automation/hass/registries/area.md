---
title: Area
id: hass-area
sidebar_position: 1
---

The `area` registry reflects Home Assistant areas.

## Service Interactions

| public property | description                                       |
| --------------- | ------------------------------------------------- |
| `apply`         | Takes in area + entities, sets area of entity     |
| `create`        | Creates a new area in home assitant               |
| `current`       | Current array of known areas                      |
| `delete`        | Remove an area from home assistant                |
| `list`          | Request a fresh list of areas from home assistant |
| `update`        | Modify an existing area                           |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TAreaId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickAnArea(area_id: TAreaId) {
      //
    },
  };
}
```
