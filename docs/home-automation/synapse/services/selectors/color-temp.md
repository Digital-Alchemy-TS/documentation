---
title: Color Temperature Selector
id: synapse-selector-color-temp
---

The `ColorTemp` selector provides an input for color temperature values (typically used for lights).

## Options

All color temperature selectors accept these common metadata options:
- `default?: number` - Default color temperature value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

ColorTemp-specific options (from `ServiceListSelector["color_temp"]`):
- `unit?: "kelvin" | "mired"` - The unit of measurement for color temperature
- `min?: number` - Minimum color temperature value
- `max?: number` - Maximum color temperature value
- `max_mireds?: number` - Maximum color temperature in mireds
- `min_mireds?: number` - Minimum color temperature in mireds

## Return Type

The return type is always `number` (color temperature in mireds or kelvins, depending on configuration).

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
      description: "Set light color temperature",
      fields: {
        // Color temperature selector
        color_temp: ServiceField.ColorTemp({
          default: 370,
          description: "Color temperature in mireds",
          required: true,
        }),
      },
    },
    async data => {
      // data.color_temp is typed as: number
      logger.info(`Color temperature set to: ${data.color_temp}`);
    }
  );
}
```
