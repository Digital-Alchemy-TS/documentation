## Description

The websocket api provides a managed method of communicating with home assistant. It will automatically connect and authenticate, coordinate events and updates, and more.

## Wait for response

By default, the `socket.sendMessage` will return a promise that resolves when Home Assistant responds back to the message that was sent. 

> This functionality can be disabled on a per message basis with an optional argument. 

## Pause traffic

#Service/runtime-configurable

The websocket supports the flag `pauseMessages: boolean`. If this is set to true, the websocket will work to actively prevent the application from interacting with Home Assistant, without shutting down.

1. block all outgoing websocket messages aside from `ping`/`pong` heartbeats
2. block events coming from events / entity updates

## `onConnect`

The websocket connection and authentication flow is kicked off by the #Lifecycle/onBootstrap event (to be available by #Lifecycle/onReady), but the websocket may reconnect several times through an application's lifecycle. 

If your code cares more about the "fresh connection", instead of "initial boot", it is best to use `hass.socket.onConnect` as your event source
## Working with events

The websocket gives a direct view into the inner goings on Home Assistant via it's event bus. You are able to consume topic events easily directly off the socket, as well as sending generic events back to other code to consume. 

> [!hint] `synapse` takes advantage of this to interact with a custom component

Use `hass.socket.onEvent` to source from the event bus, and `hass.socket.fireEvent` to emit new ones

## Safety Features

### Load Based
The socket will keeping track of the average rate of outgoing requests from your application. There are 2 thresholds you can configure

1. #config/hass/SOCKET_WARN_REQUESTS_PER_SEC 
2. #config/hass/SOCKET_CRASH_REQUESTS_PER_SEC

With the first, the application will emit warnings that it is sending a lot of messages. With the second, the application will self terminate emitting errors. 

These values can be tuned, and the feature disabled if not desired. The intent is to identify when code is stuck in a loop, rapidly sending messages to Home Assistant. 

### Safe Callbacks
The extension provides multiple levels of error trapping for your code, keeping your automation system running in the midst of your new idea going wrong.