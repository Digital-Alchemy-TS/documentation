---
title: Duration Selector
id: synapse-selector-duration
---

The `Duration` selector provides an input for time duration values.

## Options

All duration selectors accept these common metadata options:
- `default?: string | number` - Default duration value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Duration-specific options (from `ServiceListSelector["duration"]`):
- `enable_day?: boolean` - Whether to enable day selection in duration input
- `enable_millisecond?: boolean` - Whether to enable millisecond precision in duration input
- `allow_negative?: boolean` - Whether to allow negative duration values

## Return Type

The return type is `string | number` (can be a string like "00:05:00" or a number of seconds).

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
      description: "Set a delay",
      fields: {
        // Duration selector
        delay: ServiceField.Duration({
          default: 5,
          description: "Delay in seconds",
          required: true,
        }),
      },
    },
    async data => {
      // data.delay is typed as: string | number
      logger.info(`Delay set to: ${data.delay}`);
    }
  );
}
```
