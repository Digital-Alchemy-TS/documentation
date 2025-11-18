---
title: 🏡 Home Assistant
sidebar_position: 1
---
import ReactPlayer from 'react-player'

## 📚 Description

Welcome to `@digital-alchemy/hass`!

This repository contains generic extensions for interacting with Home Assistant, including websocket & REST API adapters, entity & event management, backup workflows, and more.

## ⭐ Features

### 🖥 First-class Editor Experiences

- Did you just typo that entity name?
- Just what services are actually available?

Create references to entities that will always reflect their current state. Get details about all the services your setup supports and how to use them, directly in your editor.

![editor](/img/editor.png)

### 📺 In action

Pictures really only tell half the story, here is the editing experience in VSCode. See the Intellisense in action

<ReactPlayer playing controls url='/intro.mp4' playing={false} />

### 🔧 Advanced Capabilities

- **Entity State Modification**: Directly set entity states and attributes
- **Historical Data Access**: Query entity state history over time periods
- **Unique ID Lookups**: Find entities by their unique identifiers
- **Performance Diagnostics**: Monitor service calls and entity operations
- **Rate Limiting**: Built-in protection against runaway code

## 📒 Library Configuration

### 🛠 Custom Types

This library has support for customizing type definitions to match a particular Home Assistant install. This functionality requires the [type-writer](https://github.com/Digital-Alchemy-TS/type-writer) command to be installed as well.

>
> Add to `devDependencies`!

```bash
yarn add -D @digital-alchemy/type-writer
npx type-writer
```

Custom types only affect the development experience and have no impact on the way the application runs.
