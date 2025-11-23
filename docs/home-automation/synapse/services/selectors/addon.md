---
title: Addon Selector
id: synapse-selector-addon
---

The `Addon` selector provides a picker for Home Assistant add-ons.

## Options

All addon selectors accept these common metadata options:
- `default?: { name?: string; slug?: string }` - Default selected addon
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Addon-specific options (from `ServiceListSelector["addon"]`):
- `name?: string` - The name of the addon
- `slug?: string` - The slug identifier of the addon

## Return Type

The return type is always `{ name?: string; slug?: string }`.

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
      description: "Manage an addon",
      fields: {
        // Addon selector
        addon: ServiceField.Addon({
          description: "Addon to manage",
          required: true,
        }),
      },
    },
    async data => {
      // data.addon is typed as: { name?: string; slug?: string }
      logger.info(`Managing addon: ${data.addon.slug || data.addon.name}`);
    }
  );
}
```
