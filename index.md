## 🌐 Overview

`@digital-alchemy` is a collection of modern Typescript based tools, which focus on Home Automation and other non-web use cases.

> [!info] See the main project on GitHub https://github.com/Digital-Alchemy-TS

## 🏞 The Sights

### 🏛 [[01 Core/index|Core Library]]

> [!warning] Getting "creative" with Typescript here
> Take advantage of [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to keep more of your services on hand

The core library provides all the basic library, application, and service [[wiring|wiring tools]]; allowing the easy construction of standardized services. Also provided are a comprehensive set of boilerplate utilities, covering [[configuration]], [[logger|logging]], [[cache|caching]], and more.
### 🏡 [[02 Home Automation/index|Home Automation]]

> [!tldr] `TL;DR` Make Home Assistant do cool stuff with Typescript

| Type             | Library                                                                         | Description                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Library          | [[02 Home Automation/02.01 hass/index\|@digital-alchemy/hass]]                  | Rest & websocket adapters for Home Assistant                                                                                          |
| Library          | [[02 Home Automation/02.02 synapse/index\|@digital-alchemy/synapse]]            | Entity generation tools                                                                                                               |
| Library          | [[02 Home Automation/02.03 automation/index\|@digital-alchemy/automation]]      | Higher level automation logic                                                                                                         |
| Application      | [[04 Minor Applications/04.01 Type Writer/index\|@digital-alchemy/type-writer]] | Describe your Home Assistant install in typescript types. Writes to [[02 Home Automation/02.01 hass/index\|hass]] directly by default |
| Custom Component | [[02 Home Automation/02.09 synapse-extension/index\|Synapse Custom Component]]  | The HACS integration for interacting with [[02 Home Automation/02.02 synapse/index\|synapse]]                                         |
| Template         | [[07 Automation Quickstart/index\|Automation Quickstart]]                       | Quickstart repo for creating new Home Automation applications. Perfect for supervised installs!                                       |
### 💼 [[03 Support Libraries/index|Support Libraries]]

> [!tldr] `TL;DR` Code support for other useful services too!

| Library                                                                        | Description                                                                                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| [[03 Support Libraries/03.01 fastify/index\|@digital-alchemy/fastify]]         | Reference to [fastify](https://fastify.dev/) instance. Respects configuration and application lifecycle |
| [[03 Support Libraries/03.02 mqtt/index\|@digital-alchemy/mqtt-extension]]     | Easy configured bindings for [mqtt](https://www.npmjs.com/package/mqtt)                                 |
| [[03 Support Libraries/03.03 gotify/index\|@digital-alchemy/gotify-extension]] | API bindings for [gotify](https://gotify.net/)                                                          |
| [[03 Support Libraries/03.04 grocy/index\|@digital-alchemy/grocy]]             | API bindings for [grocy](https://grocy.info/)                                                           |

### Side Projects

### [[05 Terminal/index|Terminal]]

> [!todo] More soon...

### [[06 Pi Matrix/index|Pi Matrix]]

> [!todo] More soon...