---
title: Target Selector
id: synapse-selector-target
sidebar_position: 2
---

The `target` property is related to `fields`, they both provide inputs for calling and will affect the incoming payload.
Whenever `target` is provided, `data` will **ALWAYS** have these properties added to the type definition (providing options based on your setup).

> ⚠️ This is a utility to use when you want to be open to just about any list of targets. For more precise operations, stick `fields` instead

```typescript
type TargetSelectorData = {
  entity_id?: PICK_ENTITY | PICK_ENTITY[];
  device_id?: TDeviceId | TDeviceId[];
  label_id?: TLabelId | TLabelId[];
  area_id?: TAreaId | TAreaId[];
}
```

When the service is invoked, any combination of the above types may be provided.
- only `entity_id` / `label_id` / ...
- may be array or single item

```typescript
synapse.service.create(
  {
    // ...
    target: {
      device: {
        integration: "synapse",
      },
      entity: {
        domain: ["button", "sensor"],
      },
    },
  },
  async data => {
    // data automatically will infer type from target
    // { entity_id: PICK_ENTITY<"button" | "sensor">, device_id: ... }
  }
);
```

Whenever you provide `target`, you are **NOT ALLOWED** to use use fields with keys names that conflict with one of the target properties.

![result](/img/synapse-test-command-2.png)
