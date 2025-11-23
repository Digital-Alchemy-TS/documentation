---
title: Select Selector
id: synapse-selector-select
---

The `Select` selector provides a dropdown menu for choosing from a predefined list of options.

## Options

All select selectors accept these common metadata options:
- `default?: SelectOptionUnion<OPTIONS>` - Default selected option
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Select-specific options (from `ServiceListSelector["select"]`):
- `options: (string | { label: string; value: string })[]` - Array of available options. Can be strings or objects with `value` and `label`
- `multiple?: boolean` - When `true`, allows selecting multiple options (returns array of option values)
- `custom_value?: boolean` - Whether custom values can be entered
- `mode?: "dropdown" | "list"` - Display mode: "dropdown" or "list"
- `translation_key?: string` - Translation key for the select field
- `sort?: boolean` - Whether to sort the options

## Return Type

The return type is inferred from the `options` array:
- Single value: `SelectOptionUnion<OPTIONS>` (union of all option values)
- Multiple values: `SelectOptionUnion<OPTIONS>[]`

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
      description: "Choose a mode",
      fields: {
        // Select dropdown with predefined options
        mode: ServiceField.Select({
          options: ["auto", "manual", "eco", "off"],
          default: "auto",
          description: "Operating mode",
          required: true,
        }),
      },
    },
    async data => {
      // data.mode is typed as: "auto" | "manual" | "eco" | "off"
      logger.info(`Selected mode: ${data.mode}`);
    }
  );
}
```
