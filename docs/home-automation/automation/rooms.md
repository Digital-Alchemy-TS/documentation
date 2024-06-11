---
title: 🏡 Rooms
sidebar_position: 5
---
## 📚 Description

Rooms offer a method to coordinate multiple entities together.
This is primarily accomplished through the generation of scenes and other related entities, then using those to coordinate other entities.

## 🌐 Room Details

For the most part, rooms are intended to manage themselves and there are no directly required interactions for the object itself.

| Property                 | Type            | Description                                                                          |
| ------------------------ | --------------- | ------------------------------------------------------------------------------------ |
| `scene`                  | `string`        | The current scene of the room. Can be assigned to as shorthand the same service call |
| `currentSceneDefinition` | `object`        | The definition of the current scene, detailing light and sensor settings.            |
| `currentSceneEntity`     | `sensor entity` | The virtual sensor entity representing the current scene in the room.                |
| `sceneId`                | `helper`        | A function to get the Home Assistant entity ID of a specified scene.                 |

## 🛠 Example

> Create rooms, with the ability to coordinate sets of entities together in scenes.

```typescript
import { CronExpression, TServiceParams } from "@digital-alchemy/core";

export function ExampleRoom({
  automation,
  scheduler,
  hass,
  context,
}: TServiceParams) {
  // generate a room with scenes, sensors, etc
  const room = automation.room({
    context,
    name: "Example",
    scenes: {
      high: {
        definition: {
          "light.ceiling_fan": { brightness: 255, state: "on" },
        },
        friendly_name: "High",
      },
      off: {
        definition: {
          "light.ceiling_fan": { state: "off" },
        },
        friendly_name: "Off",
      },
    },
  });

  // easy bindings for setting scene
  scheduler.cron({
    exec: () => (room.scene = "high"),
    schedule: CronExpression.EVERY_DAY_AT_8AM,
  });

  // or set it through the service
  scheduler.cron({
    exec: async () => await hass.call.scene.turn_on({
      entity_id: "scene.example_off"
    }),
    schedule: CronExpression.EVERY_DAY_AT_8PM,
  });

  return room;
}
```

## Aggressive Scenes

## 📝 Description

Aggressive scenes are a service to assist [rooms](/automation/rooms), and don't have a lot of use to external applications. It is best interacted with via config properties.

## ⚙️ Configuration

>
> Disable globally with [AGGRESSIVE_SCENES](/automation/config/AGGRESSIVE_SCENES)
>
> Set up a room with scenes that can be set, but with the aggressive

```typescript
export function Example({ automation }: TServiceParams) {
  automation.room({
    context,
    name: "Kitchen",
    scenes: {
      high: {
        aggressive: false,
        definition: {
          "switch.bar_light": { state: "on" },
          "switch.dining_room_light": { state: "on" },
          "switch.kitchen_light": { state: "on" },
        },
        friendly_name: "High",
      },
      off: {
        aggressive: false,
        definition: {
          "switch.bar_light": { state: "off" },
          "switch.dining_room_light": { state: "off" },
          "switch.kitchen_light": { state: "off" },
        },
        friendly_name: "Off",
      },
    },
  });
}
```

## Light Manager

The light manager is an internal utility, intended to support [rooms](/automation/rooms) as they manipulate lights.

## 💡 Circadian Mode Lights

If lights aren't flagged as being in a particular color, then the light manager will work to manage the lights in circadian mode. As the target changes, the lights will have their current target temperature changed.

This is intended to work as a continual process, updating a set number of entities at once at a constant rate.

- [CIRCADIAN_DIFF_THRESHOLD](/automation/config/CIRCADIAN_DIFF_THRESHOLD)
If the current temperature of the light exceeds this threshold, then it will be queued for update.

- [CIRCADIAN_RATE](/automation/config/CIRCADIAN_RATE)
How many entities to attempt to update at once. This includes device communication time, and an artificial throttle rate.

- [CIRCADIAN_THROTTLE](/automation/config/CIRCADIAN_THROTTLE)
Wait a little bit longer before moving on to the next entity. Helps keep the load on home assistant.

### 📐 Design note

> **Warning**: The default values are tight already.
> Lower is not better.

A non-obvious effect of decreasing the diff threshold is increased `light.turn_on` calls. By increasing the rate at which these happen, you will experience more situations where a `turn_off` command as a result of a scene set (or similar) will conflict with the `turn_on` used to change the temperature.

This situation self-corrects via [Aggressive Scenes](/automation/aggressive-scenes), but the experience is less than ideal.
