---
title: Area Selector
id: synapse-selector-area
---

The `Area` selector provides an area picker for selecting Home Assistant areas.

> ⚠️ **Note**: This selector can provide part of the functionality of the `target` property (specifically `area_id`), but for more flexible target selection that supports multiple target types simultaneously, use the `target` property instead. See [Target Selector](/docs/home-automation/synapse/services/synapse-selector-target) for details.

## Options

All area selectors accept these common metadata options:
- `default?: TAreaId` - Default selected area
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Area-specific options (from `ServiceListSelector["area"]`):
- `device?: DeviceFilterSelector | DeviceFilterSelector[]` - Filter areas by device
- `entity?: EntityFilterSelector | EntityFilterSelector[]` - Filter areas by entity
- `multiple?: boolean` - When `true`, allows selecting multiple areas (returns `TAreaId[]`)

## Return Type

- `TAreaId` when `multiple` is not set or `false`
- `TAreaId[]` when `multiple: true`

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
      description: "Configure area settings",
      fields: {
        // Area selector
        area: ServiceField.Area({
          description: "Area to configure",
          required: true,
        }),
      },
    },
    async data => {
      // data.area is typed as: TAreaId
      logger.info(`Configuring area: ${data.area}`);
    }
  );
}
```
