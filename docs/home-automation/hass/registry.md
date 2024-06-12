---
title: "📇 Registry"
authors: [zoe-codez]
sidebar_position: 3
---

The `hass` library maintains a copy of the home assistant registry locally, and exposes a variety of tools for interacting with it.

## 🎭 Entities

The entity tools are the most complex for the project.
They cover a variety of search tools for creating type safe groupings of entities, tools for manipulating metadata such as `entity_id`, and even the ability to remove entities!

These are most useful for batch operations, where you need to perform the same change to a lot of entities.

### 🏷️ Managing labels

```typescript
hass.entity.registry.addLabel({
  entity: big_entity_list,
  label: "active_sensors"
});

hass.entity.registry.removeLabel({
  entity: "sensor.example",
  label: "active_sensors"
});
```

### ⚠️ Removing Entities

> **Warning**: This is destructive!

Purge entities from the instance.

Did an integration leave behind a pile of entities that just need to go?
This is the fast way

```typescript
hass.entity.registry.removeEntity(
  hass.idBy.platform("mean_integration")
);
```

## 🐕‍🦺 Helper Registries

The following Home Assistant registries are exposed through the library.

- area
- label
- device
- floor
- zone

Each contains tools for `create`, `delete`, `update`, `list`, and an array of all the current data.
Some helpers are also have special features

| Type | Feature | Note |
| --- | --- |  --- |
| `area` | `apply` | set the area of an entity |
| `device` | no ability to manipulate | that's a real world problem 🤷‍♀️ |
