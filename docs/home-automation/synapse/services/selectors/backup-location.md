---
title: Backup Location Selector
id: synapse-selector-backup-location
---

The `BackupLocation` selector provides a picker for backup storage locations.

## Options

BackupLocation selectors accept these common metadata options:
- `default?: string` - Default backup location
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
      description: "Create a backup",
      fields: {
        // Backup location selector
        location: ServiceField.BackupLocation({
          description: "Where to store the backup",
          required: true,
        }),
      },
    },
    async data => {
      // data.location is typed as: string
      logger.info(`Backing up to: ${data.location}`);
    }
  );
}
```
