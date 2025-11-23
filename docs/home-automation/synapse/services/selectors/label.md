---
title: Label Selector
id: synapse-selector-label
---

The `Label` selector provides a label picker for selecting Home Assistant labels.

> ⚠️ **Note**: This selector can provide part of the functionality of the `target` property (specifically `label_id`), but for more flexible target selection that supports multiple target types simultaneously, use the `target` property instead. See [Target Selector](/docs/home-automation/synapse/services/synapse-selector-target) for details.

## Options

All label selectors accept these common metadata options:
- `default?: TLabelId` - Default selected label
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Label-specific options (from `ServiceListSelector["label"]`):
- `multiple?: boolean` - When `true`, allows selecting multiple labels (returns `TLabelId[]`)

## Return Type

- `TLabelId` when `multiple` is not set or `false`
- `TLabelId[]` when `multiple: true`

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
      description: "Apply label-based action",
      fields: {
        // Label selector
        label: ServiceField.Label({
          description: "Label to target",
          required: true,
        }),
      },
    },
    async data => {
      // data.label is typed as: TLabelId
      logger.info(`Targeting label: ${data.label}`);
    }
  );
}
```
