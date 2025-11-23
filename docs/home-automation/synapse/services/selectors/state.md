---
title: State Selector
id: synapse-selector-state
---

The `State` selector provides an input for entity state values.

## Options

All state selectors accept these common metadata options:
- `default?: string | number` - Default state value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

State-specific options (from `ServiceListSelector["state"]`):
- `entity_id?: PICK_ENTITY` - Entity ID to get states from
- `multiple?: boolean` - When `true`, allows selecting multiple states (returns array)
- `hide_states?: string[]` - List of state values to hide from the selector

## Return Type

- `string | number` when `multiple` is not set or `false`
- `(string | number)[]` when `multiple: true`

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
      description: "Set entity state",
      fields: {
        // State selector
        target_state: ServiceField.State({
          description: "Target state value",
          required: true,
        }),
      },
    },
    async data => {
      // data.target_state is typed as: string | number
      logger.info(`Setting state to: ${data.target_state}`);
    }
  );
}
```
