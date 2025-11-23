---
title: Entity
id: hass-entity
sidebar_position: 1
---

The entity registry is dual purpose:

- contains tools for accessing entity registry details
- contains tools for actively tracking and managing state locally within the app

It powers a variety of interal workflows for `hass` as well as downstream libraries like `synapse`.

## State Utilities

The entity registry maintains `MASTER_STATE` & `PREVIOUS_STATE` variables internally, providing function access with a more traditional access pattern.

No proxy objects required.

| method            | description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `getCurrentState` | returns current state for an entity                               |
| `previousState`   | returns previous state for an entity                              |
| `history`         | entity history search utilities                                   |
| `listEntities`    | list all entities in the registry, optionally filtering by domain |
| `refresh`         | fetch all entities from home assistant, rebuild local data        |

## Registry Utilities

The registry utilities provide additional ways for working with entities that go beyond their basic state.

| method                  | description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `addLabel`              | add a label to an entity                                                             |
| `removeLabel`           | remove a labelm from an entity                                                       |
| `current`               | array of known entities in Home Assitant registry (hopefully 1-1 with entity states) |
| `registryList` / `list` | request the current list of entity configurations (`config/entity_registry/list`)    |
| `removeEntity`          | equiv to clicking **delete** button in Lovelace (`config/entity_registry/remove`)    |
| `source`                | `entity/source`                                                                      |
