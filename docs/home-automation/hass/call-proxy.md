---
title: "📣 Call Proxy"
authors: [zoe-codez]
sidebar_position: 2
---
## 📚 Description

The call proxy is a deceptively simple service designed to provide a natural-feeling service calling interface for Home Assistant.
It creates a general [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) interface, and passes through any valid call to the [websocket](/hass/websocket-api) as a service call.

> Issue a simple call via the call proxy

```typescript
export function Example({ hass }: TServiceParams) {
  async function onSomeEvent() {
    // hass.call.{service_domain}.{service_name}({ ...data })
    await hass.call.switch.turn_on({
      entity_id: "switch.example_switch"
    });
  }
}
```

### Custom Types

On its own, the Call Proxy isn't all that smart. It simply makes a service call based on what you provide, hoping it's valid. The real magic comes in when [type-writer](/type-writer) gets involved. The call proxy will adjust to match the specific set of services available on your install, with accurate parameter definitions for every service.

## ⚠️ Gotchas

### Services With Responses

Some services provide response data as part of the service call, for example `weather.get_forecasts`.
See [issue](https://github.com/Digital-Alchemy-TS/hass/issues/34)

### Lifecycle availability

Calling services cannot be done prior to the `onReady` lifecycle event.
Attempts to do that will not work, and will result an error message + stack trace.

```typescript
export function Example({ hass, lifecycle }: TServiceParams) {
  // 🛑 will not work
  hass.call.switch.turn_on(...)

  lifecycle.onReady(() => {
    // ✅ services can be called now
    hass.call.switch.turn_on(...)
  });

  hass.entity.byId(...).onUpdate(() => {
    // ✅ here works too
    hass.call.switch.turn_on(...)
  });
}
```
