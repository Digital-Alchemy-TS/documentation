---
tags: []
---
## 📚 Description

The Websocket API is a self-managed method of communicating with Home Assistant. It will automatically connect and auth, coordinate events and updates, and more!

## 🌐 Connection Management

> [!help]
> Connection manager only active with [AUTO_CONNECT_SOCKET](/home-automation/hass/config/AUTO_CONNECT_SOCKET)

**Extra configurations**:
- [WEBSOCKET_URL](/home-automation/hass/config/WEBSOCKET_URL) | [BASE_URL](/home-automation/hass/config/BASE_URL)
- [TOKEN](/home-automation/hass/config/TOKEN)
- [RETRY_INTERVAL](/home-automation/hass/config/RETRY_INTERVAL)

The socket will initially form a connection on [onPostConfig](/core/lifecycle/onPostConfig), and work with a [schedule](/core/scheduler) to ensure that the connection stays valid. If/when Home Assistant restarts, the socket will work to re-establish the connection and mitigate the impact on the application.

The socket will automatically teardown [onShutdownStart](/core/lifecycle/onShutdownStart).

### Lifecycle interactions

>
> `hass.socket.onConnect` may run more than once more than once

The initial websocket connection fully completes it's authentication flow as part of the [onPostConfig](/core/lifecycle/onPostConfig), allowing you to place

### 🔄 `onConnect`

The websocket connection and authentication flow is kicked off by the [onBootstrap](/core/lifecycle/onBootstrap) event (to be available by [onReady](/core/lifecycle/onReady)), but the websocket may reconnect several times through an application's lifecycle.

If your code cares more about the "fresh connection", instead of "initial boot", it is best to use `hass.socket.onConnect` as your event source.

### ⚖️ Load-based safety

> **Warning**:
> Application may commit sudoku if it detects too much traffic.
> In an attempt to not nuke your Home Assistant install, the websocket will keep a running average of traffic. Too much = 💣

The load based safety mechanism prevents an accidental infinite loops from emitting so many calls to Home Assistant that it locks up also. If you are experiencing warnings / terminations when processing large groups of entities, add mechanisms to spread your updates out in time before adjusting / disabling the feature. The default values are be many times higher than a healthy application should emit.

| Config                            | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| [SOCKET_WARN_REQUESTS_PER_SEC](/home-automation/hass/config/SOCKET_WARN_REQUESTS_PER_SEC)  | Threshold to emit warnings at.                       |
| [SOCKET_CRASH_REQUESTS_PER_SEC](/home-automation/hass/config/SOCKET_CRASH_REQUESTS_PER_SEC) | Threshold to actually terminate at.                  |
| [SOCKET_AVG_DURATION](/home-automation/hass/config/SOCKET_AVG_DURATION)           | How many seconds of data to take into consideration. |

## 🕒 Wait for response

By default, the `socket.sendMessage` will return a promise that resolves when Home Assistant responds back to the message that was sent. You have the ability to disable this logic if you desire, leading to no return response from your request.

`sendMessage` will wait for [EXPECT_RESPONSE_AFTER](/home-automation/hass/config/EXPECT_RESPONSE_AFTER) seconds to receive a response from Home Assistant. If one is not received, a warning is logged and the response promise is discarded. This can occur when there are issues with the connection.

## ⏸ Pause traffic


The websocket supports the flag `pauseMessages: boolean`. If this is set to true, the websocket will work to actively prevent the application from interacting with Home Assistant, without shutting down.

**Specific effects:**
- Block all outgoing websocket messages aside from `ping`/`pong` heartbeats.
- Block events coming from events/entity updates.

> In this contrived example, there is a sibling service that exists to track when all instances of this application are online. If a dev server is started at the same time a "production" is running, the production will defer

```typescript
function Example({ hass, app, config }: TServiceParams) {
  app.siblings.onSystemStateUpdate(() => {
    if (
      config.app.ENVIRONMENT === "production" &&
      hass.socket.pauseMessages !== app.siblings.developIsRunning
    ) {
      logger.info(
        `socket pause state [%s] > [%s]`,
        hass.socket.pauseMessages,
        app.siblings.developIsRunning,
      );
      hass.socket.pauseMessages = app.siblings.developIsRunning;
    }
  });
}
```

## 📡 Working with events

The websocket gives a direct view into the inner workings of Home Assistant via its event bus. You are able to consume topic events easily directly off the socket, as well as sending generic events back to other code to consume.

> [synapse](/home-automation/synapse) takes advantage of this to interact with a custom component.

| Export      | Description                                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `fireEvent` | A convenient wrapper for `sendMessage` that allows firing an event via the Home Assistant event bus.                                         |
| `onEvent`   | Attaches to the incoming stream of socket events, allowing custom filtering and processing. Returns a function to remove the event listener. |
