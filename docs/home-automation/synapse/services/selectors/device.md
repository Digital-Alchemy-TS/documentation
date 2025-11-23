---
title: Device Selector
id: synapse-selector-device
---

The `Device` selector provides a device picker that can be filtered by integration.

> ⚠️ **Note**: This selector can provide part of the functionality of the `target` property (specifically `device_id`), but for more flexible target selection that supports multiple target types simultaneously, use the `target` property instead. See [Target Selector](/docs/home-automation/synapse/services/synapse-selector-target) for details.

## Options

All device selectors accept these common metadata options:
- `default?: TDeviceId` - Default selected device
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Device-specific options (from `ServiceListSelector["device"]`):
- `integration?: TPlatformId` - Filter devices by integration/platform
- `manufacturer?: string` - Filter devices by manufacturer
- `model?: string` - Filter devices by model
- `multiple?: boolean` - When `true`, allows selecting multiple devices (returns `TDeviceId[]`)
- `filter?: DeviceFilterSelector | DeviceFilterSelector[]` - Additional device filter selector(s)
- `entity?: EntityFilterSelector | EntityFilterSelector[]` - Filter devices by their entities

## Return Type

- `TDeviceId` when `multiple` is not set or `false`
- `TDeviceId[]` when `multiple: true`

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
      description: "Configure a device",
      fields: {
        // Device selector filtered by integration
        device: ServiceField.Device({
          integration: "synapse",
          description: "Device to configure",
          required: true,
        }),
      },
    },
    async data => {
      // data.device is typed as: TDeviceId
      logger.info(`Configuring device: ${data.device}`);
    }
  );
}
```
