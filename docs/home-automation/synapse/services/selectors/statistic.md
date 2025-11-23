---
title: Statistic Selector
id: synapse-selector-statistic
---

The `Statistic` selector provides a picker for Home Assistant statistics.

## Options

All statistic selectors accept these common metadata options:
- `default?: string` - Default selected statistic
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Statistic-specific options (from `ServiceListSelector["statistic"]`):
- `multiple?: boolean` - When `true`, allows selecting multiple statistics (returns `string[]`)

## Return Type

- `string` when `multiple` is not set or `false`
- `string[]` when `multiple: true`

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
      description: "Query a statistic",
      fields: {
        // Statistic selector
        statistic: ServiceField.Statistic({
          description: "Statistic to query",
          required: true,
        }),
      },
    },
    async data => {
      // data.statistic is typed as: string
      logger.info(`Querying statistic: ${data.statistic}`);
    }
  );
}
```
