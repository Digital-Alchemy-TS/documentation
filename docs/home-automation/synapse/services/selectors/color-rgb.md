---
title: Color RGB Selector
id: synapse-selector-color-rgb
---

The `ColorRgb` selector provides a color picker that returns RGB values.

## Options

ColorRgb selectors accept these common metadata options:
- `default?: [number, number, number]` - Default RGB color as a tuple `[red, green, blue]` (0-255 each)
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `[number, number, number]` (RGB tuple with values 0-255).

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
      description: "Set RGB color",
      fields: {
        // RGB color picker
        color: ServiceField.ColorRgb({
          default: [255, 0, 0],
          description: "RGB color value",
          required: true,
        }),
      },
    },
    async data => {
      // data.color is typed as: [number, number, number]
      const [r, g, b] = data.color;
      logger.info(`Color set to RGB(${r}, ${g}, ${b})`);
    }
  );
}
```
