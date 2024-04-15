---
aliases: []
---

## 👋 Welcome

`@digital-alchemy` is a Typescript based project that targets hobby / home automation type use cases. It is built up as a series of smaller projects that can be mixed together in various combinations.

- [Project GitHub](https://github.com/Digital-Alchemy-TS)
- [Discord](https://discord.gg/JkZ35Gv97Y)

## 📇 The Sights

### 🏗 [Core Library](<./core>)

The core library provides all the basic library, application, and service wiring tools; allowing the easy construction of standardized services. Also provided are a comprehensive set of boilerplate utilities, covering:

- [Configuration](./core/configuration)
- [Logging](./core/logger)
- [Caching](./core/cache)
- and more!

### 🏡 [Home Automation](./home-automation)

> [!tldr]
> Make Home Assistant do cool stuff with Typescript

| Project                               | Description                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [Hass](./home-automation/hass)               | Rest & websocket adapters for Home Assistant                                                             |
| [Synapse](./home-automation/synapse)         | Entity generation tools                                                                                  |
| [Automation](./home-automation/automation)   | Higher level automation logic                                                                            |
| [Type Writer](./home-automation/type-writer) | Describe your Home Assistant install in typescript types. Writes to the hass library directly by default |

#### 🥏 Misc
| Project                                                   | Description                                                                                     |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Synapse Custom Component](./home-automation/synapse-extension)  | The HACS integration for interacting with synapse library                                       |
| [Automation Quickstart](./quickstart/automation) | Quickstart repo for creating new Home Automation applications. Perfect for supervised installs! |
| [Generic Quickstart](./quickstart/generic)                                    | A blank project that only utilizes core                                                         |

### 💼 [[Support Libraries Overview|Support Libraries]]

> [!tldr]
 Code support for other useful services too!

| Project                         | Description                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Fastify](./support-libraries/fastify/)   | Reference to [fastify](https://fastify.dev/) instance. Respects configuration and application lifecycle |
| [MQTT](./support-libraries/mqtt)         | Easy configured bindings for [mqtt](https://www.npmjs.com/package/mqtt)                                 |
| [Gotify](./support-libraries/gotify)     | API bindings for [gotify](https://gotify.net/)                                                          |
| [Grocy](./support-libraries/grocy)       | API bindings for [grocy](https://grocy.info/)                                                           |
| [Terminal](./terminal) | Advanced terminal utilities                                                                             |
