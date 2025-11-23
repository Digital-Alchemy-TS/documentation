---
title: Devices
id: synapse-devices
sidebar_position: 4
---

With synapse, you are able to create new devices within the Home Assistant registry.

By default a device is created to represent your application, with all entities being credited against that.
Registering new devices allows you to specify new groupings.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function DeviceCreateService({ synapse, context }: TServiceParams) {
  // #1 - create a new device
  const demoDevice = synapse.device.register("demo_device", {
    manufacturer: "Digital Alchemy",
    model: "Synapse Demo",
    name: "Synapse Dynamic Demo Device",
    sw_version: "1.0.0",
  });

  // #2 - adjust entity to use device
  synapse.binary_sensor({
    context,
    device_id: demoDevice,
    name: "Example Sensor",
  });
}
```
