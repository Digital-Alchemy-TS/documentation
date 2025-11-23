---
title: Label
id: hass-label
sidebar_position: 1
---

The `label` registry reflects Home Assistant labels.
The entity registry contains tools for applying labels to entities

## Service Interactions

| public property | description                                        |
| --------------- | -------------------------------------------------- |
| `create`        | Creates a new label in home assitant               |
| `current`       | Current array of known labels                      |
| `delete`        | Remove an label from home assistant                |
| `list`          | Request a fresh list of labels from home assistant |
| `update`        | Modify an existing label                           |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TLabelId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickALabel(label_id: TLabelId) {
      //
    },
  };
}
```
