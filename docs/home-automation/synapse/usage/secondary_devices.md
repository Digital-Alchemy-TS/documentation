---
title: 🖥️ Secondary Devices
---

In order to further group together entities logically within Home Assistant, you can generate dedicated artificial devices to register.

```typescript
const subDevice = synapse.device.register("sub_device_id", {
  name: "Example sub device",
  ...options
});
synapse.sensor({
  device_id: subDevice,
});
```

This device will be registered as being provided `via_device` of the application default device.
