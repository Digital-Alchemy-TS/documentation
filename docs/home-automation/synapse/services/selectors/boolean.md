---
title: Boolean Selector
id: synapse-selector-boolean
---

The `Boolean` selector provides a checkbox or toggle input for true/false values.

## Options

Boolean selectors accept these common metadata options:
- `default?: boolean` - Default value for the field
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `boolean`.

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
      description: "Toggle feature on or off",
      fields: {
        // Boolean checkbox/toggle
        enabled: ServiceField.Boolean({
          default: false,
          description: "Enable the feature",
          required: true,
        }),
      },
    },
    async data => {
      // data.enabled is typed as: boolean
      logger.info(`Feature enabled: ${data.enabled}`);
    }
  );
}
```
