`@digital-alchemy` is a collection of modern Typescript based tools, which focus on Home Automation and other non-web use cases.

> [!info] See the main project on GitHub https://github.com/Digital-Alchemy-TS
> Join Discord: http://discord.digital-alchemy.app/

## 🏞 The Sights

### 🏛 [[🧭 Core Overview|Core Library]]

> [!warning] Getting "creative" with Typescript here
> Take advantage of [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to keep more of your services on hand

The core library provides all the basic library, application, and service wiring tools; allowing the easy construction of standardized services. Also provided are a comprehensive set of boilerplate utilities, covering:

- [[configuration]]
- [[logger|logging]]
- [[cache|caching]]
- and more!
### 🏡 [[🧭 Home Automation Overview|Home Automation]]

> [!tldr] `TL;DR` Make Home Assistant do cool stuff with Typescript

#### 🗒 Typescript Based

- [[🧭 Hass Overview|@digital-alchemy/hass]] - Rest & websocket adapters for Home Assistant
- [[🧭 Synapse Overview|@digital-alchemy/synapse]] - Entity generation tools
- [[🧭 Automation Overview|@digital-alchemy/automation]] - Higher level automation logic
- [[🧭 Type Writer Overview|@digital-alchemy/type-writer]] - Describe your Home Assistant install in typescript types. Writes to the hass library directly by default
#### 🥏 Misc
- [[🧭 Synapse Extension Overview|Synapse Custom Component]] - The HACS integration for interacting with synapse library
- [[🧭 Automation Quickstart Overview|Automation Quickstart]] - Quickstart repo for creating new Home Automation applications. Perfect for supervised installs!

### 💼 [[🧭 Support Libraries Overview|Support Libraries]]

> [!tldr] `TL;DR` Code support for other useful services too!

- [[🧭 Fastify Overview|@digital-alchemy/fastify]] - Reference to [fastify](https://fastify.dev/) instance. Respects configuration and application lifecycle
- [[🧭 MQTT Overview|@digital-alchemy/mqtt-extension]] - Easy configured bindings for [mqtt](https://www.npmjs.com/package/mqtt)
- [[🧭 Gotify Overview|@digital-alchemy/gotify-extension]] - API bindings for [gotify](https://gotify.net/)
- [[🧭 Grocy Overview|@digital-alchemy/grocy]] - API bindings for [grocy](https://grocy.info/)

### Side Projects

### [[🧭 Terminal Overview|Terminal]]

> [!todo] More soon...

### [[🧭 Pi Matrix Overview|Pi Matrix]]

> [!todo] More soon...