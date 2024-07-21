---
title: MQTT
---

Welcome to `@digital-alchemy/mqtt-extension`!

- [GitHub](https://github.com/Digital-Alchemy-TS/mqtt)
- [NPM](https://www.npmjs.com/package/@digital-alchemy/mqtt-extension)

## 💾 Install

This library can be installed as a simple dependency

```bash
npm i @digital-alchemy/mqtt-extension
```

Then added to your project

```typescript
import { LIB_MQTT } from "@digital-alchemy/mqtt-extension";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_MQTT],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_MQTT],
  name: "special_logic",
})
```

> 🎉
> Listing as an import will automatically load into `LoadedModules` and make the library features available as `mqtt` on `TServiceParams`.

## ⚙️ Configuration

This configuration block can be added to your

```ini
[mqtt.CLIENT_OPTIONS]
  host=localhost
  ; username=me
  ; password=super-strong-password
  port=1883
```

## 🛠 Usage

> **Caution**: Library is in an "experimental" state
> More useful services will be added in the future

### 🔄 Bindings

The bindings file is an "everything in one file". It handles

- Connection at `onPostConfig`
- logging standard events (error messages, reconnect events, etc)

#### ➕ subscribe

The subscribe method will automatically listen to topics for you, and pass through messages to your provided callback. You can use wildcards in your topics:

- `+` - single level  (`device/+/turned_off` )
- `#` - multi level wildcard (`device/thing/#`)

```typescript
type MessageData = {}
mqtt.bindings.subscribe({
  topic: "my/topic",
  exec(message: MessageData) {
    logger.info("my topic was sent!")
  },
});
```

#### 📤 publish

Simple wrapper for the `publish` method on the mqtt client.

```typescript
mqtt.bindings.publish("my/topic")
mqtt.bindings.publish("my/topic",{
  extra_payload_data: {},
  foo: "bar"
})
```

#### 🔍 getClient

Need something more complicated? Retrieve the already configured mqtt instance

```typescript
const client = mqtt.bindings.getClient();
```
