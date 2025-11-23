---
title: Icon Selector
id: synapse-selector-icon
---

The `Icon` selector provides an icon picker for selecting Material Design Icons.

## Options

All icon selectors accept these common metadata options:
- `default?: string` - Default selected icon name
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Icon-specific options (from `ServiceListSelector["icon"]`):
- `placeholder?: string` - Placeholder text for the icon selector

## Return Type

The return type is always `string` (icon name, e.g., "mdi:home").

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
      description: "Set an icon",
      fields: {
        // Icon selector
        icon: ServiceField.Icon({
          default: "mdi:home",
          description: "Icon to display",
          required: true,
        }),
      },
    },
    async data => {
      // data.icon is typed as: string
      logger.info(`Selected icon: ${data.icon}`);
    }
  );
}
```
