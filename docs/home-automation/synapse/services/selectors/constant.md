---
title: Constant Selector
id: synapse-selector-constant
---

The `Constant` selector provides a fixed constant value that cannot be changed by the user.

## Options

All constant selectors accept these common metadata options:
- `default?: string | number | boolean` - Default constant value (though this is typically the only value)
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Constant-specific options (from `ServiceListSelector["constant"]`):
- `value: string | number | boolean` - The constant value (required)
- `label?: string` - Display label for the constant value
- `translation_key?: string` - Translation key for the label

## Return Type

The return type is `string | number | boolean`.

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
      description: "Service with constant value",
      fields: {
        // Constant selector (fixed value)
        version: ServiceField.Constant({
          default: "1.0.0",
          description: "Service version",
          required: true,
        }),
      },
    },
    async data => {
      // data.version is typed as: string | number | boolean
      logger.info(`Service version: ${data.version}`);
    }
  );
}
```
