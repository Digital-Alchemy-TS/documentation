---
title: Target Selector
id: synapse-selector-target
---

The `Target` selector provides a target picker that can select entities or devices.

> ⚠️ **Note**: This selector provides similar functionality to the `target` property on service creation, but as a field selector. For more flexible target selection that supports multiple target types simultaneously (entity_id, device_id, label_id, area_id), use the `target` property instead. See [Target Selector](/docs/home-automation/synapse/services/synapse-selector-target) for details.

## Options

All target selectors accept these common metadata options:
- `default?: PICK_ENTITY | TDeviceId` - Default selected target
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Target-specific options (from `ServiceListSelector["target"]`):
- `entity?: EntityFilterSelector | EntityFilterSelector[]` - Entity filter selector(s) to filter targets by entity (mutually exclusive with `device`)
- `device?: DeviceFilterSelector | DeviceFilterSelector[]` - Device filter selector(s) to filter targets by device (mutually exclusive with `entity`)

## Return Type

The return type is `PICK_ENTITY | TDeviceId`.

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
      description: "Target an entity or device",
      fields: {
        // Target selector
        target: ServiceField.Target({
          description: "Entity or device to target",
          required: true,
        }),
      },
    },
    async data => {
      // data.target is typed as: PICK_ENTITY | TDeviceId
      logger.info(`Targeting: ${data.target}`);
    }
  );
}
```
