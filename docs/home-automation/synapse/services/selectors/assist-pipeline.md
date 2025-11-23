---
title: Assist Pipeline Selector
id: synapse-selector-assist-pipeline
---

The `AssistPipeline` selector provides a picker for Home Assistant assist pipelines.

## Options

AssistPipeline selectors accept these common metadata options:
- `default?: string` - Default selected pipeline
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

## Return Type

The return type is always `string`.

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
      description: "Configure assist pipeline",
      fields: {
        // Assist pipeline selector
        pipeline: ServiceField.AssistPipeline({
          description: "Assist pipeline to use",
          required: true,
        }),
      },
    },
    async data => {
      // data.pipeline is typed as: string
      logger.info(`Using pipeline: ${data.pipeline}`);
    }
  );
}
```
