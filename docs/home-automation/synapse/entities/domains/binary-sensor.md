---
title: "Binary Sensor"
authors: [zoe-codez]
---

`synapse.binary_sensor` is a simple entity for reflecting a non-user-controllable binary state as an entity.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/binary-sensor)

## ✏️ Usage

> minimum properties

```typescript
synapse.binary_sensor({
  context,
  name: "My binary sensor entity"
});
```

## Entity specific attributes

### ⚙️ Configuration

#### `is_on`

This property represents the current state of the entity as a boolean.

#### `device_class`

| Enum Value           | Description                                                               |
|----------------------|---------------------------------------------------------------------------|
| `battery`            | On means low, Off means normal                                            |
| `battery_charging`   | On means charging, Off means not charging                                 |
| `co`                 | On means carbon monoxide detected, Off means no carbon monoxide (clear)   |
| `cold`               | On means cold, Off means normal                                           |
| `connectivity`       | On means connected, Off means disconnected                                |
| `door`               | On means open, Off means closed                                           |
| `garage_door`        | On means open, Off means closed                                           |
| `gas`                | On means gas detected, Off means no gas (clear)                           |
| `heat`               | On means hot, Off means normal                                            |
| `light`              | On means light detected, Off means no light                               |
| `lock`               | On means open (unlocked), Off means closed (locked)                       |
| `moisture`           | On means wet, Off means dry                                               |
| `motion`             | On means motion detected, Off means no motion (clear)                     |
| `moving`             | On means moving, Off means not moving (stopped)                           |
| `occupancy`          | On means occupied, Off means not occupied (clear)                         |
| `opening`            | On means open, Off means closed                                           |
| `plug`               | On means plugged in, Off means unplugged                                  |
| `power`              | On means power detected, Off means no power                               |
| `presence`           | On means home, Off means away                                             |
| `problem`            | On means problem detected, Off means no problem (OK)                      |
| `running`            | On means running, Off means not running                                   |
| `safety`             | On means unsafe, Off means safe                                           |
| `smoke`              | On means smoke detected, Off means no smoke (clear)                       |
| `sound`              | On means sound detected, Off means no sound (clear)                       |
| `tamper`             | On means tampering detected, Off means no tampering (clear)               |
| `update`             | On means update available, Off means up-to-date                           |
| `vibration`          | On means vibration detected, Off means no vibration                       |
| `window`             | On means open, Off means closed                                           |
