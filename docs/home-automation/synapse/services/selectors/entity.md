---
title: Entity Selector
id: synapse-selector-entity
---

The `Entity` selector provides an entity picker that can be filtered by domain and/or integration.

> ⚠️ **Note**: This selector can provide part of the functionality of the `target` property (specifically `entity_id`), but for more flexible target selection that supports multiple target types simultaneously, use the `target` property instead. See [Target Selector](/docs/home-automation/synapse/services/synapse-selector-target) for details.

## Options

All entity selectors accept these common metadata options:
- `default?: PICK_ENTITY | PICK_FROM_PLATFORM<...>` - Default selected entity
- `description?: string` - Human-readable description shown in the UI
- `required?: boolean` - Whether the field must be provided

Entity-specific options (from `ServiceListSelector["entity"]`):
- `domain?: ALL_DOMAINS | ALL_DOMAINS[]` - Filter entities by domain(s) (e.g., `"light"`, `["button", "sensor"]`)
- `integration?: TPlatformId` - Filter entities by integration/platform. When provided with `domain`, uses `PICK_FROM_PLATFORM` typing
- `device_class?: string | string[]` - Filter entities by device class
- `supported_features?: string | string[]` - Filter entities by supported features
- `multiple?: boolean` - When `true`, allows selecting multiple entities (returns array)
- `reorder?: boolean` - Whether entities can be reordered
- `filter?: EntityFilterSelector | EntityFilterSelector[]` - Additional entity filter selector(s)
- `include_entities?: PICK_ENTITY | PICK_ENTITY[]` - Entity ID(s) to include in the selector (mutually exclusive with `exclude_entities`)
- `exclude_entities?: PICK_ENTITY | PICK_ENTITY[]` - Entity ID(s) to exclude from the selector (mutually exclusive with `include_entities`)

## Return Type

The return type depends on the options provided:
- With `integration` and `domain`: `PICK_FROM_PLATFORM<INTEGRATION, ExtractDomainUnion<DOMAIN>>` or array
- With only `domain`: `PICK_ENTITY<DOMAIN>` or array
- Without filters: `PICK_ENTITY` or array

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
      description: "Control a light entity",
      fields: {
        // Entity selector filtered to light domain
        light_entity: ServiceField.Entity({
          domain: "light",
          description: "Light to control",
          required: true,
        }),
      },
    },
    async data => {
      // data.light_entity is typed as: PICK_ENTITY<"light">
      logger.info(`Controlling light: ${data.light_entity}`);
    }
  );
}
```
