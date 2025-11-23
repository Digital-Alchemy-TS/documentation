---
title: DateTime Selector
id: synapse-selector-datetime
---

The `DateTime` selector provides a combined date and time picker input.

## Options

DateTime selectors accept these common metadata options:
- `default?: string` - Default datetime value (ISO format string)
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string` (ISO datetime format, e.g., "2024-01-15T14:30:00").

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
      description: "Schedule a task",
      fields: {
        // DateTime picker
        scheduled_time: ServiceField.DateTime({
          description: "When to execute the task",
          required: true,
        }),
      },
    },
    async data => {
      // data.scheduled_time is typed as: string
      logger.info(`Task scheduled for: ${data.scheduled_time}`);
    }
  );
}
```
