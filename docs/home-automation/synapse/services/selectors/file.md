---
title: File Selector
id: synapse-selector-file
---

The `File` selector provides a file picker input.

## Options

All file selectors accept these common metadata options:
- `default?: string` - Default file path
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

File-specific options (from `ServiceListSelector["file"]`):
- `accept: string` - MIME type(s) or file extension(s) to accept (required)

## Return Type

The return type is always `string` (file path).

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
      description: "Process a file",
      fields: {
        // File selector
        file_path: ServiceField.File({
          description: "File to process",
          required: true,
        }),
      },
    },
    async data => {
      // data.file_path is typed as: string
      logger.info(`Processing file: ${data.file_path}`);
    }
  );
}
```
