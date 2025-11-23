---
title: Field Selectors
id: synapse-selector-fields
sidebar_position: 1
---

The fields object is a general purpose object that can be used for requesting any data. They come in the format of `{ key: Selector }`

Selectors are defined via the imported `ServiceField` object

```typescript
synapse.service.create(
  {
    // ...
    fields: {
      delay: ServiceField.Number({
        default: 0,
        description: "Delay in seconds",
        max: 300,
        min: 0,
        required: true,
        step: 1,
        unit_of_measurement: "s",
      }),
      message: ServiceField.Text({
        description: "Message to send",
        multiline: true,
        required: true,
      }),
    },
  },
  async data => {
    // data automatically will infer type from fields
    // { delay: number, message: string }
  }
);
```

> Resulting service inside Home Assistant UI

![result](/img/synapse-test-command-1.png)
