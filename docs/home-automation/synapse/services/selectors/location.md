---
title: Location Selector
id: synapse-selector-location
---

The `Location` selector provides a map-based location picker.

## Options

All location selectors accept these common metadata options:
- `default?: { latitude: number; longitude: number; radius?: number }` - Default location coordinates
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Location-specific options (from `ServiceListSelector["location"]`):
- `radius?: boolean` - Whether to include radius selection
- `icon?: string` - Icon to display for the location selector

## Return Type

The return type is always `{ latitude: number; longitude: number; radius?: number }`.

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
      description: "Set a location",
      fields: {
        // Location picker
        location: ServiceField.Location({
          default: { latitude: 40.7128, longitude: -74.006 },
          description: "Target location",
          required: true,
        }),
      },
    },
    async data => {
      // data.location is typed as: { latitude: number; longitude: number; radius?: number }
      logger.info(`Location: ${data.location.latitude}, ${data.location.longitude}`);
    }
  );
}
```
