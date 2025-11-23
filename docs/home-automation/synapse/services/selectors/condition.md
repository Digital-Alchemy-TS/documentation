---
title: Condition Selector
id: synapse-selector-condition
---

The `Condition` selector provides an input for automation condition configurations.

## Options

Condition selectors accept these common metadata options:
- `default?: unknown` - Default condition value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `unknown` (condition configuration structure).

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
      description: "Evaluate a condition",
      fields: {
        // Condition selector
        condition: ServiceField.Condition({
          description: "Condition to evaluate",
          required: true,
        }),
      },
    },
    async data => {
      // data.condition is typed as: unknown
      logger.info(`Evaluating condition: ${JSON.stringify(data.condition)}`);
    }
  );
}
```
