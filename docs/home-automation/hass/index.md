---
title: Hass
sidebar_position: 1
---
import ReactPlayer from 'react-player'

## 📚 Description

Welcome to `@digital-alchemy/hass`!

This repository contains generic extensions for interacting with Home Assistant, including websocket & REST API adapters, entity & event management, backup workflows, and more.

- [0.3.x changelog](/hass/changelog/0.3.x)

## Install

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/hass
```

> **Add to code**

```typescript
import { LIB_HASS } from "@digital-alchemy/hass";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS],
  name: "special_logic",
})
```

> 🎉 **Success**
> Listing as an import will automatically load into [LoadedModules](/docs/core/exports/LoadedModules) and make the library features available as `hass` on [TServiceParams](/docs/core/exports/TServiceParams).

## ⭐ Features

### 🖥 First-class Editor Experiences

- Did you just typo that entity name?
- Just what services are actually available?

Create references to entities that will always reflect their current state. Get details about all the services your setup supports and how to use them, directly in your editor.

![editor](/img/editor.png)

### 📺 In action

Pictures really only tell half the story, here is the editing experience in VSCode. See the Intellisense in action

<ReactPlayer playing controls url='/intro.mp4' playing={false} />

### 🛠 Services

- [Call Proxy](/hass/call-proxy) - Type friendly service calls for your setup
- [Entity Manager](/hass/entity-manager) - Work with entity history, create "always accurate" entity references, receive updates, and more!
- [Rest API](/hass/rest-api) - Quick bindings for commands accessible via the rest api
- [Websocket API](/hass/websocket-api) - Connect to Home Assistant via thw websocket api, issue commands, listen to events, and more
- [Special Logic](/hass/special-logic) - Specialized logic that doesn't fit anywhere else around here

## 📒 Library Configuration

### 🛠 Custom Types

This library has support for customizing type definitions to match a particular Home Assistant install. This functionality requires the [type-writer](https://github.com/Digital-Alchemy-TS/type-writer) command to be installed as well.

>
> Add to `devDependencies`!

```bash
npm i --save-dev @digital-alchemy/type-writer
npx type-writer
```

Custom types only affect the development experience and have no impact on the way the application runs.

### 🤖 Supervised Support

If your code is running within a Home Assistant addon environment, it will automatically connect with no additional configuration needed.

### 🔧 [Manual Configuration](/docs/core/configuration)

For code running elsewhere, manual configuration is required. You will need a **Long Lived Access Token**, which can be generated on your user profile.

> Basic configuration to connect

```ini
[hass]
  BASE_URL=http://localhost:8123
  TOKEN=YOUR LONG LIVED ACCESS TOKEN
```

### Unit Testing

See the dedicated [unit testing guide](/hass/unit-testing)
