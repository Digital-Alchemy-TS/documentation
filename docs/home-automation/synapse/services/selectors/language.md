---
title: Language Selector
id: synapse-selector-language
---

The `Language` selector provides a picker for language codes.

## Options

All language selectors accept these common metadata options:
- `default?: string` - Default selected language code
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Language-specific options (from `ServiceListSelector["language"]`):
- `languages?: SupportedLanguages | SupportedLanguages[]` - Language code(s) to include in the selector
- `native_name?: boolean` - Whether to display native language names
- `no_sort?: boolean` - Whether to disable sorting of languages

## Return Type

The return type is always `string` (language code, e.g., "en", "es", "fr").

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
      description: "Set language preference",
      fields: {
        // Language selector
        language: ServiceField.Language({
          default: "en",
          description: "Language code",
          required: true,
        }),
      },
    },
    async data => {
      // data.language is typed as: string
      logger.info(`Selected language: ${data.language}`);
    }
  );
}
```
