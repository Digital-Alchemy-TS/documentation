---
title: Automation/Managed Switch
---
### 📄 Description

Sometimes devices don't get the message the first time. Other times a pesky human comes by and bumps a switch, turning off a switch that really should be left on. The `managed_switch` service allows for a rules-based approach to managing the switch state. You provide a function that returns `true` / `false` / `undefined`, and the service will check the result at specific times, and adjust the indicated switch accordingly.

### 💡 Usage Example

> This example sets up a plant light with the following rules:
>
> - turn on at sunrise
> - turn off at dusk, or 5:30PM, whichever occurs first
> - turn off after 3PM, if the AC is kicking on (that light gets warm)

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleRoom({ automation, context, hass }: TServiceParams) {
  const upstairsThermostat = hass.entity.byId("climate.upstairs");

  automation.managed_switch({
    context,
    entity_id: "switch.plant_light",
    // should immediately update if the `.onUpdate` callback runs for anything in this array
    onUpdate: [upstairsThermostat],
    shouldBeOn() {
      // check sun position, if it's dark out then light should be off by default
      if (automation.solar.isBetween("dawn", "dusk")) {

        // create some reference points with dayjs
        const [PM530, PM3, NOW] = automation.utils.shortTime([
          "PM5:30",
          "PM3",
          "NOW",
        ]);

        // before 3PM? keep on
        if (NOW.isBefore(PM3)) {
          return true;
        }

        // before 5:30PM, but after 3PM?
        if (NOW.isBefore(PM530)) {
          // if AC is on, turn off light
          if (upstairsThermostat.attributes.hvac_action === "cooling") {
            return false;
          }
          // otherwise, maintain state (don't turn back on if AC flips off)
          return undefined;
        }
      }
      // it's dark out, or after 5:30PM
      return false;
    },
  });
}
```
