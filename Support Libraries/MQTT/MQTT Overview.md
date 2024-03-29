---
aliases:
  - MQTT
---

## 📚 Description

Welcome to `@digital-alchemy/mqtt-extension`!

- [GitHub](https://github.com/Digital-Alchemy-TS/mqtt)
- [NPM](https://www.npmjs.com/package/@digital-alchemy/mqtt-extension)
- [[MQTT 0.3.x|0.3.x changelog]]
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
> [!success]
> Listing as an import will automatically load into [[LoadedModules]] and make the library features available as `mqtt` on [[TServiceParams]].

## ⚙️ Configuration

> [!example] #Usage-Example/mqtt
> [[CLIENT_OPTIONS]] gets passed straight to mqtt library.

This configuration block can be added to your 
```ini
[mqtt.CLIENT_OPTIONS]
  host=localhost
  ; username=me
  ; password=super-strong-password
  port=1883
```
## 🛠 Usage

> [!caution] Library is in an "experimental" state
> More useful services will be added in the future

### 🔄 Bindings

The bindings file is an "everything in one file". It handles
- Connection at [[onPostConfig]]
- logging standard events (error messages, reconnect events, etc)

#### ➕ subscribe

The subscribe method will automatically listen to topics for you, and pass through messages to your provided callback. You can use wildcards in your topics:
- `+` - single level  (`device/+/turned_off` )
- `#` - multi level wildcard (`device/thingie/#`)


> [!example] #Usage-Example/mqtt

```typescript
import { TServiceParams } from "@digital-alchemy/core";

type YourMessage = {}
export function Example({ logger, mqtt, context }: TServiceParams) {
  mqtt.bindings.subscribe({
    context,
    exec(message:YourMessage) {
      logger.info("my topic was sent!")
    },
    topic: "my/topic",
  });
}
```

#### 📤 publish

Simple wrapper for the `publish` method on the mqtt client. 

> [!example] #Usage-Example/mqtt

```typescript
import { TServiceParams } from "@digital-alchemy/core";

type YourMessage = {}
export function Example({ logger, mqtt, lifecycle }: TServiceParams) {

  lifecycle.onReady(() => {
    mqtt.bindings.publish("my/topic")
    mqtt.bindings.publish("my/topic",{ 
	    extra_payload_data: {}, 
	    foo: "bar" 
	})
  })
}
```

#### 🔍 getClient

> [!example] #Usage-Example/mqtt 

Need something more complicated? Retrieve the already configured mqtt instance

```typescript
import { TServiceParams } from "@digital-alchemy/core";

type YourMessage = {}
export function Example({ mqtt, lifecycle }: TServiceParams) {

  lifecycle.onBootstrap(() => {
    const client = mqtt.bindings.getClient();
    
  })
}
```