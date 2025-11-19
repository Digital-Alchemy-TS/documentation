---
title: Type-Writer
id: hass-type-writer
sidebar_position: 1
---

[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/type-writer)](https://github.com/Digital-Alchemy-TS/type-writer)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/type-writer)](https://www.npmjs.com/package/@digital-alchemy/type-writer)

## Overview

`type-writer` is a companion project to the `hass` project, it exists to fill in all the juicy details to the library generic interfaces.
The project is runnable as a script, which builds type definitions in your project as the output.

### Goal

The script generates outputs for:

- pre-calculated mapping tables for `area`, `device`, `unique_id`, and more
- entity details registry describing `state` & `attributes`
- service call registry with definitions for params and inline support documentation

These files are all grouped together into `src/hass`, which does automatically does it's job just by existing.

### Limitations

- **Intermittent Attributes**
Some entities may add / remove attributes based on various conditions.
This can cause intermittent results depending on when the script is run relative to the entity state.
See Custom Attributes section for notes on how to resolve this.

- **Crashes & missing output**
Occasionally an integration will implement a schema which the code has not been built to translate.
This can simply present as silently missing details, but if severe enough it may result in the script crashing.

Please report if this occurs

## Usage

1. install dependencies

```bash
yarn add -D @digital-alchemy/type-writer
```

2. run script

```bash
npx type-writer
```

3. reload editor

## Custom Attributes

With some entities, attributes can appear and disappear while your code is running.
Type Writer can only capture snapshots of your setup, and is not able to present attributes that are not there at the moment the script is run.

#### The fix

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
