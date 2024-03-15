## Description

The entity manager actively maintains a copy of the current state inside the application, providing that state back to your application in the form of entity references and convenient update events.

## State Management

As part of #Lifecycle/onPostConfig, the entity manager will pre-populate with with the current state. It receives priority treatment for receiving update events via the websocket.
## Entity References

You can retrieve an entity reference by using the `.byId` method. The returned reference will have all the `state` & `attributes` maintained up to date with the current state. You can keep your logic simple, and do the lookup only once

```typescript
export function MyService({ hass, logger }: TServiceParams) {
  const mySensor = hass.entity.byId("sensor.my_special_sensor");

  function SomeRandomLogic() {
    // ...
    return mySensor.state;
  }

  mySensor.onUpdate(() => {
    logger.info({ state: mySensor.state }, `special sensor updated`)
  });
}
```
