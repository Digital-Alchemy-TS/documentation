---
title: 💡 Managed Switch
sidebar_position: 1
---

`automation.managed_switch` provides a simple interface active management of switch entities.

Gone are the days of attaching to a series of events, building complex state tracking logic, and hoping someone doesn't accidentally poke a button.

`managed_switch` lets you describe your workflow for figuring out if the light **should** be on, and makes that happen.

## 👶 Basic Example

A more traditional automation

```typescript
const mySwitch = hass.refBy.id("switch.porch_light");
scheduler.cron({
  schedule: CronExpression.EVERY_DAY_AT_8PM,
  exec: () => mySwitch.turn_on()
});
scheduler.cron({
  schedule: CronExpression.EVERY_DAY_AT_5AM,
  exec: () => mySwitch.turn_off()
});
```

Using managed switch

```typescript
automation.managed_switch({
  context,
  entity_id: "switch.porch_light",
  shouldBeOn: () => !automation.time.isBetween("AM5", "PM8")
})
```

## 💪 Getting more complex

Even with a simple example like that, the readability is dramatically improved taking a managed approach.
Things only get better as your logic gets more complex.
Switch state can be recalculated on demand in response to other entities updating.

```typescript
const houseMode = hass.refBy.id("select.house_mode");
automation.managed_switch({
  context,
  entity_id: "switch.porch_light",
  onUpdate: [houseMode],
  shouldBeOn() {
    if (houseMode.state === "guest") {
      return !automation.time.isBetween("AM5", "PM5");
    }
    return !automation.time.isBetween("AM5", "PM8");
  }
})
```

Now when the `select` entity that manages house mode is changed, the `turn_on` time of the porch light changes.

In the above example, if time was in the magical zone of between `5PM` & `8PM`, the switch state is directly tied to the current house mode.
Changing modes will change the the light immediately.
