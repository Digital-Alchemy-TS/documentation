---
title: Configuration
id: hass-config
sidebar_position: 1
---

The `config` registry is used for interacting with the integration / platform registry

## Service Interactions

| public property    | description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `byTitle`          | Type safe lookups converting a platform title to `TPlatformId` |
| `current`          | Current list of known loaded platforms in home assitant        |
| `get`              | Refresh the list of loaded platforms                           |
| `getServices`      | List the known / loaded callable srvices                       |
| `isService`        | Returns `true` if (domain, service) pairing is a valid service |
| `loadServiceList ` | Refresh the list of known services                             |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TPlatformId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickAPlatform(platform_id: TPlatformId) {
      //
    },
  };
}
```
