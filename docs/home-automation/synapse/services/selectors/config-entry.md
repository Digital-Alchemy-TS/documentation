---
title: Config Entry Selector
id: synapse-selector-config-entry
---

The `ConfigEntry` selector provides a picker for Home Assistant configuration entries.

## Options

All config entry selectors accept these common metadata options:
- `default?: TConfigEntryId` - Default selected config entry
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

ConfigEntry-specific options (from `ServiceListSelector["config_entry"]`):
- `integration: TPlatformId` - The integration platform ID (required)

## Return Type

The return type is always `TConfigEntryId`.

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
      description: "Configure an integration",
      fields: {
        // Config entry selector
        config_entry: ServiceField.ConfigEntry({
          description: "Configuration entry to modify",
          required: true,
        }),
      },
    },
    async data => {
      // data.config_entry is typed as: TConfigEntryId
      logger.info(`Configuring entry: ${data.config_entry}`);
    }
  );
}
```
