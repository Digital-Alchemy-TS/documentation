## 📘 Description

- #LoadedModules
- #TServiceParams/automation
- #Usage-Example/automation 
- #config/automation

Welcome to `@digital-alchemy/automation`!

This project builds on the utilities provided by to create new home automation focused methods for easily coordinating entities.

- [NPM](https://www.npmjs.com/package/@digital-alchemy/automation)
- [GitHub](https://github.com/Digital-Alchemy-TS/automation)
- #TServiceParams/automation

## 💾 Install

> [!caution] Depends on  [[🧭 Hass Overview|@digital-alchemy/hass]] & [[🧭 Synapse Overview|@digital-alchemy/synapse]]
> As well as the [[🧭 Synapse Extension Overview|synapse custom component]] 

This library can be installed as a simple dependency
```bash
npm i @digital-alchemy/automation
```
## 🛠️ Utilities
### 🏠 Rooms w/ coordinated scenes

- #Feature/automation/room
- - [[Rooms]]

> [!example] #Usage-Example/automation/create_room
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
### 🔧 Active Management

- #Feature/automation/managed_switch
- #Feature/automation/aggressive_scene
- [[Aggressive Scenes]]
- [[Managed Switch]]

Sometimes devices don't get the message the first time. Other times a pesky human comes by and bumps a switch, turning off a switch that really should be left on. `@digital-alchemy/automation` provides several tools to help ensure devices know what they "should" be.

Scenes defined by rooms will periodically recheck entity states in their listed definitions, ensuring that the device state matches your description of what it should be. The library also provides tools for rules-based state management of switches.

> [!example] #Usage-Example/automation/managed_switch
> This example sets up a plant light should be on while the sun is up, but only until 5:30 PM

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleRoom({ automation, context }: TServiceParams) {
  automation.managed_switch({
    context,
    entity_id: "switch.plant_light",
    shouldBeOn() {
      // check sun position
      if (automation.solar.isBetween("dawn", "dusk")) {
        // create some reference points with dayjs
        const [PM530, NOW] = automation.utils.shortTime(["PM5:30", "NOW"]);
        return NOW.isBefore(PM530);
      }
      return false;
    },
  });
}
```
### 💡 Circadian Lighting

- #Feature/automation/circadian_lighting
- [[Circadian]]
- [[Light Manager]]

By default for lights defined in room scenes, if no particular color is defined, the temperature will be automatically managed for you. 

You can see the current light temperature as a dedicated sensor. Updates for light temperature are rate-limited with some configurable settings. This allows you to easily keep a natural feeling light temperature in your home, without overloading your install.

### 🧩 Advanced Pattern Matching

- #Feature/automation/sequence_matcher
- [[Sequence Matcher]]

The library includes some utilities for translating a specific pattern of events in Home Assistant into callbacks. This can enable new layers of functionality remotes, allowing for creating automations based on button sequences.

## Misc

- [[Solar]]
- [[Utils]]