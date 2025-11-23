---
title: Solar
sidebar_position: 3
---

The solar extension exists to make it easy to perform time math with reference points for the sun.
It uses `lat/long` provided by Home Assistant, updating reference points nightly with the [Scheduler](/docs/core/services/builtin/core_scheduler).

## 🌅 Reference Points

| Name          | Description                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `dawn`        | Marks the time when morning twilight begins, just before the sunrise.                                |
| `sunriseEnd`  | Indicates the end of the sunrise, when the sun is fully above the horizon.                           |
| `sunsetStart` | Represents the start of the sunset, when the sun begins to descend below the horizon.                |
| `dusk`        | Signifies the end of the evening twilight, just after the sunset.                                    |
| `nightStart`  | Marks the beginning of astronomical night, when the sun is sufficiently below the horizon.           |
| `nightEnd`    | Indicates the end of astronomical night, just before the beginning of morning twilight.              |
| `sunrise`     | The moment the upper edge of the sun appears on the horizon in the morning.                          |
| `sunset`      | The moment the upper edge of the sun disappears below the horizon in the evening.                    |
| `solarNoon`   | The time when the sun reaches its highest point in the sky for the day, directly above the observer. |

## 🌞 Usage

### Gathering reference points

```typescript
function whenIsDawn() {
  return `dawn is at ${automation.solar.dawn.format("hh:mm")}`;
}
```

### Quick math

Similar to working with `automation.time`, `solar` makes a few functions available for testing reference points.

```typescript
function isDaytime() {
  return automation.solar.isBetween("dawn", "dusk");
}
```

### Attaching to events

You can also use reference points as events!

```typescript
automation.solar.onEvent({
  eventName: "dawn",
  exec() {
    logger.info("It is dawn!");
  }
});
```

#### With offsets

`solar.onEvent` can take in offset times in a variety of formats:

| Format | Description |
| --- | --- |
| `number` | `ms` |
| `tuple` | [`quantity`, `unit`] |
| `string` | `ISO 8601` partial duration string: `(#H)(#M)(#S)` |
| `object` | mapping of units to quantities |
| `Duration` | `dayjs.duration` object |
| `function` | a function that returns any of the above |

```typescript
automation.solar.onEvent({
  eventName: "dawn",
  offset: "2h10m",
  exec: () => logger.info("2 hours 10 mins after dawn")
});
```

```typescript
automation.solar.onEvent({
  eventName: "dusk",
  offset: "-15m",
  exec: () => logger.info("15 mins before dusk")
});
```

Using a function, you can provide a different offset every day

```typescript
automation.solar.onEvent({
  eventName: "dusk",
  offset: () => Math.floor(Math.random() * HOUR),
  exec: () => logger.info("within an hour after dusk")
});
```
