---
title: Date Selector
id: synapse-selector-date
---

The `Date` selector provides a date picker input.

## Options

Date selectors accept these common metadata options:
- `default?: string` - Default date value (ISO format string)
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string` (ISO date format, e.g., "2024-01-15").

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
      description: "Schedule an event",
      fields: {
        // Date picker
        event_date: ServiceField.Date({
          description: "Date for the event",
          required: true,
        }),
      },
    },
    async data => {
      // data.event_date is typed as: string
      logger.info(`Event scheduled for: ${data.event_date}`);
    }
  );
}
```
