---
title: Object Selector
id: synapse-selector-object
---

The `Object` selector provides a structured object input with nested fields.

## Options

All object selectors accept these common metadata options:
- `default?: Record<string, unknown>` - Default object value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Object-specific options (from `ServiceListSelector["object"]`):
- `fields?: Record<string, { selector: ServiceListSelector; required?: boolean; label?: string }>` - Nested field definitions for the object structure
- `multiple?: boolean` - When `true`, allows selecting multiple objects (returns array)
- `label_field?: string` - Field name to use as the label for each object
- `description_field?: string` - Field name to use as the description for each object
- `translation_key?: string` - Translation key for the object selector

## Return Type

- `Record<string, unknown>` when `multiple` is not set or `false`
- `Record<string, unknown>[]` when `multiple: true`

When `fields` are provided, the return type is inferred from the nested field selectors, creating a typed object structure.

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
      description: "Configure settings object",
      fields: {
        // Object selector with nested fields
        config: ServiceField.Object({
          description: "Configuration object",
          required: true,
        }),
      },
    },
    async data => {
      // data.config is typed as: Record<string, unknown>
      logger.info(`Configuration: ${JSON.stringify(data.config)}`);
    }
  );
}
```
