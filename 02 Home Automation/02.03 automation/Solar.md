## Description

- #Lifecycle/onBootstrap
- [[scheduler]]

The solar extension exists to make it easy to perform time math with reference points for the sun. 

## Reference Points

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

> [!example] #Usage-Example/automation/solar_on_event
```typescript
export function Example({ automation, context, logger }: TServiceParams) {
  automation.solar.onEvent({
    context,
    eventName: "dawn",
    exec() {
      logger.info("it is dawn!");
    }
  })
}
```


> [!example] #Usage-Example/automation/solar_is_between
```typescript
export function Example({ automation, context, logger }: TServiceParams) {
  function isDaytime() {
    return automation.solar.isBetween("dawn", "dusk");
  }
}
```