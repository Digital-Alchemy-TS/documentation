---
title: "📣 Call Proxy"
sidebar_position: 2
---
## 📚 Description

The call proxy is a deceptively simple service designed to provide a natural-feeling service-calling interface for Home Assistant.
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

## 📐 Custom Types

On its own, the Call Proxy isn't all that smart. It simply makes a service call based on what you provide, hoping it's valid. The real magic comes in when [type-writer](/type-writer) gets involved. The call proxy will adjust to match the specific set of services available on your install, with accurate parameter definitions for every service.

## ⚙️ Configuration

> Home assistant supports service calls via rest. You can request all commands be emitted this way via configuration [CALL_PROXY_ALLOW_REST](/hass/config/CALL_PROXY_ALLOW_REST)

As part of the [onBootstrap](/core/lifecycle/onBootstrap) workflow, the call proxy will perform a quick scan of the services available. If this workflow doesn't apply to your application, you can disable it with: [AUTO_SCAN_CALL_PROXY](/hass/config/AUTO_SCAN_CALL_PROXY)
