---
title: Trigger Selector
id: synapse-selector-trigger
---

The `Trigger` selector provides an input for automation trigger configurations.

## Options

Trigger selectors accept these common metadata options:
- `default?: unknown` - Default trigger value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `unknown` (trigger configuration structure).

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
      description: "Configure a trigger",
      fields: {
        // Trigger selector
        trigger: ServiceField.Trigger({
          description: "Trigger configuration",
          required: true,
        }),
      },
    },
    async data => {
      // data.trigger is typed as: unknown
      logger.info(`Trigger config: ${JSON.stringify(data.trigger)}`);
    }
  );
}
```
