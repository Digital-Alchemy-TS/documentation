---
title: Country Selector
id: synapse-selector-country
---

The `Country` selector provides a picker for country codes.

## Options

All country selectors accept these common metadata options:
- `default?: SupportedCountries | SupportedCountries[]` - Default selected country/countries
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Country-specific options (from `ServiceListSelector["country"]`):
- `countries?: SupportedCountries | SupportedCountries[]` - Country code(s) to include in the selector
- `no_sort?: boolean` - Whether to disable sorting of countries

## Return Type

The return type is `SupportedCountries | SupportedCountries[]` (depending on whether multiple selection is enabled).

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
      description: "Set country preference",
      fields: {
        // Country selector
        country: ServiceField.Country({
          description: "Country code",
          required: true,
        }),
      },
    },
    async data => {
      // data.country is typed as: SupportedCountries | SupportedCountries[]
      logger.info(`Selected country: ${data.country}`);
    }
  );
}
```
