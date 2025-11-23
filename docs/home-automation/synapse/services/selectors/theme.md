---
title: Theme Selector
id: synapse-selector-theme
---

The `Theme` selector provides a picker for Home Assistant themes.

## Options

All theme selectors accept these common metadata options:
- `default?: keyof HassThemeMapping` - Default selected theme
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Theme-specific options (from `ServiceListSelector["theme"]`):
- `include_defaults?: boolean` - Whether to include default themes in the selector

## Return Type

The return type is always `keyof HassThemeMapping` (theme name).

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
      description: "Set theme",
      fields: {
        // Theme selector
        theme: ServiceField.Theme({
          default: "default",
          description: "Theme to apply",
          required: true,
        }),
      },
    },
    async data => {
      // data.theme is typed as: keyof HassThemeMapping
      logger.info(`Applying theme: ${data.theme}`);
    }
  );
}
```
