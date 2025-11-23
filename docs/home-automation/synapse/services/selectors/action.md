---
title: Action Selector
id: synapse-selector-action
---

The `Action` selector provides an input for action sequences.

## Options

Action selectors accept these common metadata options:
- `default?: string` - Default action value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string`.

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
      description: "Execute an action",
      fields: {
        // Action selector
        action: ServiceField.Action({
          description: "Action to execute",
          required: true,
        }),
      },
    },
    async data => {
      // data.action is typed as: string
      logger.info(`Executing action: ${data.action}`);
    }
  );
}
```
