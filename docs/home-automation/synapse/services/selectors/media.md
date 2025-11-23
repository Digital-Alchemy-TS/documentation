---
title: Media Selector
id: synapse-selector-media
---

The `Media` selector provides a picker for media content.

## Options

All media selectors accept these common metadata options:
- `default?: string | string[]` - Default selected media
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Media-specific options (from `ServiceListSelector["media"]`):
- `accept?: string | string[]` - MIME type(s) or file extension(s) to accept

## Return Type

The return type is `string | string[]` (depending on whether multiple selection is enabled).

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
      description: "Play media",
      fields: {
        // Media selector
        media: ServiceField.Media({
          description: "Media to play",
          required: true,
        }),
      },
    },
    async data => {
      // data.media is typed as: string | string[]
      logger.info(`Playing media: ${data.media}`);
    }
  );
}
```
