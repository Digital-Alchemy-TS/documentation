---
title: "🚄 Websocket API"
authors: [zoe-codez]
sidebar_position: 5
---

The Websocket API is a self-managed method of communicating with Home Assistant. It will automatically connect and auth, coordinate events and updates, and more!

## 🌐 Connection Management

The websocket connection is not available until the [onReady](/docs/core/lifecycle) lifecycle event.
It operates completely on it's own to manage it's own state, periodically sending pings and re-establishing the connection if it ever drops.

It will even proactively disconnect the socket as part of the shutdown process.

### 🔄 `onConnect`

While the connection may be available `onReady`, your logic may be more interested on when the socket itself (re)connects.
This event is available as `onConnect`

```typescript
hass.socket.onConnect(() => {
  logger.info(`socket reconnected!`);
})
```

### 🚆 Load-based safety

The library implements several based safety mechanisms to help prevent runaway code from taking down your Home Assistant also.
If the socket detects that you are sending too many messages in a short period of time, it will first emit warnings, then self terminate.

If your use case requires sending this many messages (or more) in bursts, the values can be changed via configuration (also what are you doing?!)

## 🕒 Wait for response

By default, the `socket.sendMessage` will return a promise that resolves when Home Assistant responds back to the message that was sent.
You can also send the request fire and forget.

```typescript
// socket will expect a response from hass
await hass.socket.sendMessage({ ... })
// no waiting
await hass.socket.sendMessage({ ... }, false)
```

## 📚 Creating Subscriptions

Home Assistant has the ability to create subscriptions to different event types.
You are able to create listeners for these subscriptions directly through the socket

```typescript
hass.socket.subscribe({
  context,
  event_type: "floor_registry_updated",
  async exec() {
    logger.info("did the house fall down?");
  },
});
```

## 📡 Working with events

The websocket gives a direct view into the inner workings of Home Assistant via its event bus. You are able to consume topic events easily directly off the socket, as well as sending generic events back to other code to consume.

| Export      | Description                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `fireEvent` | A convenient wrapper for `sendMessage` that allows firing an event via the Home Assistant event bus.                                         |
| `onEvent`   | Attaches to the incoming stream of socket events, allowing custom filtering and processing. Returns a function to remove the event listener. |

```typescript
hass.socket.onEvent({
  context,
  event: "my_custom_event_name",
  async exec(data) {
    logger.info({ data }, "received my event with a payload!");
    // ... logic
    hass.socket.fireEvent("event_reply", { ...payload })
  }
})
```
