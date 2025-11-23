---
title: Hass
---

In order to validate your automations are working as expected, `@digital-alchemy/hass` includes a variety of utilities for manipulating state and patching `hass` to allow for safe assertions to be made.

> 🚟 See [fixtures](/docs/testing/automations/fixtures) documentation for details on other parts of the process
>
> ⚠️ Testing features are still under development. If the tools don't support operations you want to test, please open an issue

## LIB_MOCK_ASSISTANT

All of the tools are grouped together into their own library, but most of them are set up to do their thing automatically.
There are a few main interactions that you can perform -

- set up entity state
- emit changes
- watch service calls

### Using the tools

#### Example Automation

In this simple automation, a `fan.turn_off` call is being issued in response to a state change happening from a binary sensor

```typescript
const livingRoomOccupied = hass.refBy.id("binary_sensor.living_room_occupied");

livingRoomOccupied.onUpdate((new_state, old_state) => {
  if (old_state.state === "on" && new_state.state === "off") {
    hass.call.fan.turn_off({
      entity_id: "fan.living_room_fan"
    });
  }
})
```

#### Testing the example

There are several things that need to be done to properly verify the code above is working

- set up of initial state
- set up a spy to watch for a service call to be issued
- issue state change event
- verify service call occurred

In code form -

```typescript
await testRunner
  // set up this test to already have state available when run is executed
  .bootLibrariesFirst()

  .setup(({ mock_assistant }) => {
    // use setupState to create an initial set of conditions
    mock_assistant.entity.setupState({
      "binary_sensor.living_room_occupied": { state: "on" },
    });
  })

  .run(({ hass, mock_assistant }) => {
    // watch for service calls to be made
    const spy = jest.spyOn(hass.call.fan, "turn_off");

    // emit state change
    await mock_assistant.entity.emitChange(binary_sensor.living_room_occupied, {
      state: "off"
    });

    // observe result
    expect(spy).toHaveBeenCalledWith({ entity_id: "fan.living_room_fan" });
  });
```

### Limitations

This is not a full featured implementation of `hass`, things don't automatically happen when you call services.
Keep in mind the limitation of the situation when setting up tests
