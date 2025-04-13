---
title: 📜 Custom Attributes
sidebar_position: 2
---

## The problem

With some entities, attributes can appear and disappear while your code is running.
Type Writer can only capture snapshots of your setup, and is not able to present attributes that are not there at the moment the script is run.

## The fix

The type definition for attributes on all entities is formatted like this:

```typescript
{
  attributes: DynamicMergeAttributes<
    "domain.entity_id",
    { ...observed_attributes }
  >;
}
```

The `DynamicMergeAttributes` utility type allows you to define additional attributes in your code without touching the output files of type-writer.

```typescript
declare module "@digital-alchemy/hass" {
  export interface EntityMergeAttributes {
    "domain.entity_id": { magic_property: boolean }
  }
}
```
