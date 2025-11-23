---
title: Events
id: hass-entity-proxy-events
sidebar_position: 1
---

Entity Proxies have several utilities for listening to and filtering events events.
The most straightforward way to create one is via the `refBy` command

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleEntityProxyService({ hass }: TServiceParams) {
  const mySwitch = hass.refByid("switch.my_switch");
}
```

## onUpdate

The most common way of attaching to events is via the `.onUpdate` hook.
These run in response to entities emitting changes to their state or attributes via the socket

```typescript
mySwitch.onUpdate((new_state, old_state) => {
  if (old_state?.state === "on" && new_state?.state === "off") {
    // perform action
  }
});
```

### ⚠️ `null` states

A quick warning on `null` states - Both the `new_state` and `old_state` may be provided a `null` under certain workflows.

- `old_state` is null - first time observing entity with this id
- `new_state` is null - entity potentially deleted

This may potentially occur under other workflows, logic should be built to be tolerant of these situations

### Removing listeners

There are 2 different paths to removing a callback from `onUpdate`

1. return value

```typescript
const remove = mySwitch.onUpdate(callback);
remove();
```

2. 3rd function param

```typescript
mySwitch.onUpdate(function (new_state, old_state, remove) {
  remove();
});
```

## onStateFor

The `onStateFor` is related to `onUpdate`, but is intended to assist with situations where things need to happen a while after the state change.

> Hard coded state

```typescript
mySwitch.onStateFor({
  state: "on",
  for: [5, "minute"],
  exec: () => logger.info("switch has been left on for 5 minutes"),
});
```

> With function assertion

```typescript
mySwitch.onStateFor({
  matches: (new_state, old_state) => new_state.state === "on",
  for: [5, "minute"],
  exec: () => logger.info("switch has been left on for 5 minutes"),
});
```

As long as the condition holds true for the expected amount of time, the `exec` function will be run.

## once

Once is a related to the `.onUpdate` command, but it will only ever be run once as the name implies.

```typescript
const remove = mySwitch.once((new_state, old_state) => {
  // logic
});
```

The `once` command can be removed / cancelled with the return function.
Unline `.onUpdate`, a 3rd `remover` function is not provided

## nextState

The `nextState` command is related to `once` command, but operates as an `async` function.

```typescript
async function waitForSwitch() {
  await mySwitch.nextState({ minute: 5 });
}
```

The function will return when the entity receives a state update, or when the provided timeout (optional) expires.

## waitForState

The `waitForState` command will return a promise that only resolves when the entity matches a particular state.
Optionally provided with a timeout.

```typescript
async function waitForOn() {
  await mySwitch.turn_off();
  await mySwitch.waitForState("on", "5m");
}
```

In this example turning off the light to return to an `on` state befroe resolving

## removeAllListeners

A few related methods are also provided:

- `entity.waitForState(target_state, [timeout_ms])`: resolves promise when entity state changes to provided value
- `entity.nextState([timeout_ms])`: wait for a state change (ignores updates that doesn't change state)
- `entity.once`: same as onUpdate, but only runs once
