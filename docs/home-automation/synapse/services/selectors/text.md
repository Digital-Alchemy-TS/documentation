---
title: Text Selector
id: synapse-selector-text
---

The `Text` selector provides a text input field, optionally supporting multiline input.

## Options

All text selectors accept these common metadata options:
- `default?: string` - Default value for the field
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Text-specific options (from `ServiceListSelector["text"]`):
- `type?: "color" | "date" | "datetime-local" | "email" | "month" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" | "week"` - HTML input type for the text field
- `autocomplete?: string` - Autocomplete attribute value
- `multiline?: boolean` - Whether to show a multiline textarea instead of a single-line input
- `prefix?: string` - Prefix text to display before the input
- `suffix?: string` - Suffix text to display after the input
- `multiple?: boolean` - When `true`, allows selecting multiple text values (returns `string[]`)

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
      description: "Send a message",
      fields: {
        // Single-line text input
        title: ServiceField.Text({
          description: "Message title",
          required: true,
        }),
        // Multiline text input
        message: ServiceField.Text({
          description: "Message content",
          multiline: true,
          required: true,
        }),
      },
    },
    async data => {
      // data.title is typed as: string
      // data.message is typed as: string
      logger.info(`Title: ${data.title}`);
      logger.info(`Message: ${data.message}`);
    }
  );
}
```
