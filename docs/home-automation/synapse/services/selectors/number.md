---
title: Number Selector
id: synapse-selector-number
---

The `Number` selector provides a numeric input field with optional constraints.

## Options

All number selectors accept these common metadata options:
- `default?: number` - Default value for the field
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Number-specific options (from `ServiceListSelector["number"]`):
- `min?: number` - Minimum allowed value
- `max?: number` - Maximum allowed value
- `step?: number | "any"` - Step size for increment/decrement controls, or `"any"` for no step
- `unit_of_measurement?: string` - Unit to display (e.g., "s", "°C", "%")
- `mode?: "box" | "slider"` - Input mode: "box" for text input or "slider" for slider control
- `translation_key?: string` - Translation key for the number field

## Return Type

The return type is always `number` (not an array, even with `multiple`).

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
      description: "Set temperature with constraints",
      fields: {
        // Number selector with min/max bounds and unit
        temperature: ServiceField.Number({
          default: 20,
          description: "Target temperature",
          min: 0,
          max: 100,
          step: 0.5,
          unit_of_measurement: "°C",
          required: true,
        }),
      },
    },
    async data => {
      // data.temperature is typed as: number
      logger.info(`Setting temperature to ${data.temperature}°C`);
    }
  );
}
```
