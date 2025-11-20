---
title: Device
id: hass-device
sidebar_position: 1
---

The `device` registry reflects Home Assistant devices.

## Service Interactions

| public property | description                                         |
| --------------- | --------------------------------------------------- |
| `current`       | Current array of known devices                      |
| `list`          | Request a fresh list of devices from home assistant |

## Type Defintions

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { TDeviceId } from "@digital-alchemy/hass";

export function MyService() {
  return {
    pickADevice(device_id: TDeviceId) {
      //
    },
  };
}
```
