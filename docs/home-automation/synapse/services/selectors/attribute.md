---
title: Attribute Selector
id: synapse-selector-attribute
---

The `Attribute` selector provides an input for entity attribute values.

## Options

All attribute selectors accept these common metadata options:
- `default?: Record<string, unknown>` - Default attribute object
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Attribute-specific options (from `ServiceListSelector["attribute"]`):
- `entity_id?: PICK_ENTITY` - The entity ID to get attributes from
- `hide_attributes?: string[]` - List of attribute names to hide from the selector

## Return Type

The return type is always `Record<string, unknown>`.

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
      description: "Set entity attributes",
      fields: {
        // Attribute selector
        attributes: ServiceField.Attribute({
          description: "Attributes to set",
          required: true,
        }),
      },
    },
    async data => {
      // data.attributes is typed as: Record<string, unknown>
      logger.info(`Setting attributes: ${JSON.stringify(data.attributes)}`);
    }
  );
}
```
