## 📚 Description

- #LoadedModules
- #TServiceParams/hass
- #config/hass
- #Feature/hass

Welcome to `@digital-alchemy/hass`!

This repository contains generic extensions for interacting with Home Assistant, including websocket & REST API adapters, entity & event management, backup workflows, and more.

## ⭐ Features
### 🖥 First-class Editor Experiences

- Did you just typo that entity name?
- Just what services are actually available?

Create references to entities that will always reflect their current state. Get details about all the services your setup supports and how to use them, directly in your editor.

![[02 Home Automation/02.01 hass/assets/editor.png]]

### 🛠 Services

| Service            | Description                                                                                                                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [[Call Proxy]]     | Type friendly                                                                                                                                                                                                                                                                  |
| [[Entity Manager]] | The `EntityManager` provides a comprehensive interface for interacting with Home Assistant entities, including retrieving current states, managing entity updates through proxies, fetching historical data, and maintaining a synchronized entity state with Home Assistant.  |
| [[Rest API]]       | The `FetchAPI` offers a set of functions for interacting with Home Assistant's REST API, allowing for operations like searching calendar events, calling services, checking configurations, downloading files, customizing entities, and managing entity states, among others. |
| [[Websocket API]]  | The `WebsocketAPI` function establishes and manages a websocket connection to Home Assistant, facilitating real-time event handling, message sending, and state management through an extensive set of methods for interacting with Home Assistant's websocket API.            |
| [[Special Logic]]  | Specialized logic that doesn't fit anywhere else around here                                                                                                                                                                                                                   |

## 📒 Library Configuration
### 🛠 Custom Types

This library has support for customizing type definitions to match a particular Home Assistant install. This functionality requires the [type-writer](https://github.com/Digital-Alchemy-TS/type-writer) command to be installed as well.

> [!tip] Add to `devDependencies`!
```bash
npm i --save-dev @digital-alchemy/type-writer
npx type-writer
```
Custom types only affect the development experience and have no impact on the way the application runs.

### 🤖 Supervised Support

If your code is running within a Home Assistant addon environment, it will automatically connect with no additional configuration needed.

### 🔧 Manual

For code running elsewhere, manual configuration is required. You will need a **Long Lived Access Token**, which can be generated on your user profile.

> [!example] #Usage-Example/hass/manual_configuration
```ini
[hass]
  BASE_URL=http://localhost:8123
  TOKEN=YOUR LONG LIVED ACCESS TOKEN
```

