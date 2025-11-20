---
title: Service-Calling
id: hass-call-service
sidebar_position: 2
---


The call proxy is an ergonomic type safe interface for issuing service calls to **🏡 Home Assistant**.
It contains generated details based on all of the integrations you are currently running.

## Basic Usage

```typescript
export function ExampleService({ hass }: TServiceParams) {
  async function onSomeEvent() {
    await hass.call.switch.turn_on({
      entity_id: "switch.example_switch"
    });
  }
}
```

> 💡 examples use `entity_id` for simplity, but `device_id`, `area_id`, `label_id` are valid substitutes in many service calls.

## How it works

### Under the hood

The call proxy operates by using a javascript [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object reformat your command into a service call to the websocket api.
No runtime validation validation is done to confirm the validity of the call, only formatting messages and response handling.

A command like this

```typescript
// hass.call.{domain}.{service}(service_data)
hass.call.switch.turn_on({ entity: ["switch.example"] });
```

turns into an outgoing message of:

```json
{ domain, service, service_data, type: "call_service" }
```

The interface returns an `Promise` that will resolve after a confirmation message from **🏡 Home Assistant** is received.
If the service provides a return response, that will be provided back also.

> ❔ Service calls don't require `await` to work

### Lifecycle availability

Calling services cannot be done prior to the `onReady` lifecycle event, where the connection to **🏡 Home Assistant** is available

> Big debugging messages get printed to your console if you try

```typescript
export function Example({ hass, lifecycle }: TServiceParams) {
  // 🛑 will not work
  hass.call.switch.turn_on(...)

  lifecycle.onReady(() => {
    // ✅ services can be called now
    hass.call.switch.turn_on(...)
  });

  hass.refBy.id(...).onUpdate(() => {
    // ✅ here works too
    hass.call.switch.turn_on(...)
  });
}
```
