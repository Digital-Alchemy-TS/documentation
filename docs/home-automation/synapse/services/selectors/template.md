---
title: Template Selector
id: synapse-selector-template
---

The `Template` selector provides an input for Home Assistant template expressions.

## Options

Template selectors accept these common metadata options:
- `default?: string` - Default template value
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string` (template expression).

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
      description: "Evaluate a template",
      fields: {
        // Template selector
        template: ServiceField.Template({
          description: "Template expression to evaluate",
          required: true,
        }),
      },
    },
    async data => {
      // data.template is typed as: string
      logger.info(`Template: ${data.template}`);
    }
  );
}
```
