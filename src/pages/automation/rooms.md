---
title: Automation/Room
---
## 📚 Description

Rooms offer a method to coordinate multiple entities together. This is primarily accomplished through the generation of scenes entities. The room will use your code definition as a source of truth, working to update any entities that don't match using the [aggressive scenes](/automation/aggressive-scenes) extension

## 🌐 Room Details

For the most part, rooms are intended to manage themselves and there are no directly required interactions for the object itself. Everything can be be accomplished through standard service calls and entity interactions through the [hass](/hass) library

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
