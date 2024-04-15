---
tags:
aliases:
  - Automation
---
## 📘 Description

Welcome to `@digital-alchemy/automation`!

This project builds on the utilities provided by to create new home automation focused methods for easily coordinating entities.

- [NPM](https://www.npmjs.com/package/@digital-alchemy/automation)
- [GitHub](https://github.com/Digital-Alchemy-TS/automation)
- [[Automation 0.3.x|0.3.x changelog]]

## 💾 Install

> **Attention**:
> Depends on  [[Hass Overview|@digital-alchemy/hass]] & [[Synapse Overview|@digital-alchemy/synapse]]
> As well as the [[Synapse Extension Overview|synapse custom component]]

Add as a dependency, and add to your imports. Nice and easy
```bash
npm i @digital-alchemy/automation
```
**Add to code**
```typescript
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import { LIB_AUTOMATION } from "@digital-alchemy/automation";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],
  name: "special_logic",
})
```
> [!success]
> Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `automation` on [TServiceParams](/core/exports/TServiceParams).

## 🛠️ Utilities
### 🏠 Rooms & scenes

Create [[Rooms|rooms]] that reflect their real world counterparts. Coordinate groups of entities as scenes, and other high level operations.

### 🔧 Active Management
- [[Aggressive Scenes]]
- [[Managed Switch]]

### 💡 Circadian Lighting
- [[Circadian]]
- [[Light Manager]]

By default for lights defined in room scenes, if no particular color is defined, the temperature will be automatically managed for you.

You can see the current light temperature as a dedicated sensor. Updates for light temperature are rate-limited with some configurable settings. This allows you to easily keep a natural feeling light temperature in your home, without overloading your install.

### 🧩 Advanced Pattern Matching
- [[Sequence Matcher]]

The library includes some utilities for translating a specific pattern of events in Home Assistant into callbacks. This can enable new layers of functionality remotes, allowing for creating automations based on button sequences.

### 🔧 Misc
- [[Solar]]
- [[Utils]]
