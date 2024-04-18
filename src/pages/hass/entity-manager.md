---
title: Hass/Entity Manager
---
## 📚 Description

The entity manager actively maintains a copy of the current state inside the application, providing that state back to your application in the form of entity references and convenient update events.

## 🔄 State Management

As part of [onPostConfig](/core/lifecycle/onPostConfig), the entity manager will pre-populate with the current state. It receives priority treatment for receiving update events via the [websocket](/hass/websocket-api).

## 📝 Entity References

You can retrieve an entity reference by using the `.byId` method. The returned reference will have all the `state` & `attributes` maintained up to date with the current state. You can keep your logic simple, and do the lookup only once.

> - Grab an entity reference by id
> - Read the current state
> - Listen for updates

```typescript
export function MyService({ hass, logger }: TServiceParams) {
  const mySensor = hass.entity.byId("sensor.my_special_sensor");

  function SomeRandomLogic() {
    // ...
    return mySensor.state;
  }

  mySensor.onUpdate((new_state, old_state) => {
    logger.info(
      { state: mySensor.state },
      `special sensor updated (previously %s)`,
      mySensor.previous.state
    )
  });
}
```

## 🛠 Methods

> **Hint**:
> Grab entity references at any time, the values will track current state

### Entity methods

| Method      | Description                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onUpdate`  | Registers a callback to be run whenever the entity's state is updated, providing the new state as a parameter. -- Passes `new_state` / `old_state` as params to help decisions |
| `once`      | Similar to `onUpdate`, but the callback is run only once for the next update of the entity's state.                                                                            |
| `nextState` | Returns a promise that resolves with the next state of the entity, without any time limit on when the next state update will occur.                                            |
| `previous`  | Access the immediate previous version of an entity, same data as `old_state`                                                                                                   |

### Service methods

| Exported Function Name | Description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `byId`                 | Retrieves a proxy object for a specified entity, offering current values and event hooks.                                      |
| `findByDomain`         | Lists all entities within a specified domain, aiding in domain-specific operations or queries.                                 |
| `getCurrentState`      | Retrieves the current state of a given entity, offering raw data for a direct view of the entity's state at a specific moment. |
| `history`              | Fetches historical state data of entities over a specified time period, useful for analysis or tracking changes.               |
| `listEntities`         | Generates a simple listing of all entity IDs for enumeration and quick reference to all entities.                              |
| `refresh`              | Initiates a refresh of current entity states, ensuring synchronization with the latest state data from Home Assistant.         |
