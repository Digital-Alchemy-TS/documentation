---
title: 🔔 Event Binding
---

Some domains have the ability to send events back to the application to trigger events. Some examples may be `button.press`, `switch.toggle`, `number.set_value`, etc.

More verbose entity information about specific events can be found in the Home Assistant developer docs ([example entity](https://developers.home-assistant.io/docs/core/entity/select#methods)). You are able to set listeners for incoming events using a variety of methods.

### 📎 Inline

Bindings can be placed alongside the configuration in the definition using the event name. All data provided by `hass` as part of the service call is passed through.

```typescript
synapse.select({
  select_option({ option }) {
    logger.info({ option }, "Option was selected");
  }
});
```

### 📎 Dynamic

The dynamic attachment gives access to the same calls, using the `onEventName` camel case format. Dynamic attachments are easily detached using a provided `remove` function in the 2nd param or `remover.remove()`.

```typescript
const switchEntity = synapse.switch( ... );
const remover = switch.onTurnOn((data, remove) => {
  // logic
});
```
