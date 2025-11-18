---
title: "🔧 Usage"
sidebar_position: 3
authors: [zoe-codez]
---

This document covers the basic usage of the synapse library, creating entities, managing configurations, and attaching to events.
It provides detailed examples and explanations to help users effectively implement and utilize the synapse library in their applications.

## 💡 Basic Example

Quick and dirty everything that's needed to set up a new entity

```typescript
export function ExampleService({ logger, context, synapse }: TServiceParams) {
  synapse.button({
    // required variables
    context,
    name: "Press me",
    // doing stuff is optional
    press: () => logger.info("That tickles!"),
  });
}
```

Config properties will vary by domain, but common ones are:

| Config | Description |
| --- | --- |
| `unique_id` | Used to uniquely communicate this entity separate from entity ids |
| `suggested_object_id` | Influence the entity id generation |
| `name` | Friendly name |
| `entity_category` | Diagnostic or configuration |
| `device_id` | Optional secondary device to list against |
| `icon` | Entity icon |
| `attributes` | Secondary attributes to attach to entity (these can but shouldn't change) |

## ⚙️ Config Setting

There are a number of ways to configure and manage entities depending on the particular needs of the application. Some properties must remain constant, such as `unique_id`, but other properties are intended to be updated at runtime.

### 📑 Inline Static

The inline configuration format gives you access to all the options available to this entity. If it can be set for this entity, the option is available here.

![full sensor options](/img/synapse_sensor_full.png)
