---
title: Time Selector
id: synapse-selector-time
---

The `Time` selector provides a time picker input.

## Options

Time selectors accept these common metadata options:
- `default?: string` - Default time value (HH:mm format string)
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string` (time format, e.g., "14:30").

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
      description: "Set a time",
      fields: {
        // Time picker
        alarm_time: ServiceField.Time({
          default: "07:00",
          description: "Alarm time",
          required: true,
        }),
      },
    },
    async data => {
      // data.alarm_time is typed as: string
      logger.info(`Alarm set for: ${data.alarm_time}`);
    }
  );
}
```
