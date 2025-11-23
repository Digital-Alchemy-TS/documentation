---
title: Floor Selector
id: synapse-selector-floor
---

The `Floor` selector provides a floor picker for selecting Home Assistant floors.

## Options

All floor selectors accept these common metadata options:
- `default?: TFloorId` - Default selected floor
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Floor-specific options (from `ServiceListSelector["floor"]`):
- `entity?: EntityFilterSelector | EntityFilterSelector[]` - Filter floors by entity
- `device?: DeviceFilterSelector | DeviceFilterSelector[]` - Filter floors by device
- `multiple?: boolean` - When `true`, allows selecting multiple floors (returns `TFloorId[]`)

## Return Type

- `TFloorId` when `multiple` is not set or `false`
- `TFloorId[]` when `multiple: true`

## Example

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { ServiceField } from "@digital-alchemy/synapse";

export function SynapseServiceCreate({
  synapse,
  context,
  logger,
}: TServiceParams) {
  synapse.service.create(
    {
      context,
      description: "Configure floor settings",
      fields: {
        // Floor selector
        floor: ServiceField.Floor({
          description: "Floor to configure",
          required: true,
        }),
      },
    },
    async data => {
      // data.floor is typed as: TFloorId
      logger.info(`Configuring floor: ${data.floor}`);
    }
  );
}
```
