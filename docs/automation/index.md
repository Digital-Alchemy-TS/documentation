---
title: Automation
---
## 📘 Description

Welcome to `@digital-alchemy/automation`!

This project builds on the utilities provided by to create new home automation focused methods for easily coordinating entities.

- [NPM](https://www.npmjs.com/package/@digital-alchemy/automation)
- [GitHub](https://github.com/Digital-Alchemy-TS/automation)
- [Changelog](/automation/changelog/0.3.x)

## 💾 Install

> **Attention**:
> Depends on  [@digital-alchemy/hass](/hass) & [@digital-alchemy/synapse](/synapse)
> As well as the [synapse custom component](/synapse/extension)

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/automation
```

> **Add to code**

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

> 🎉
> Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `automation` on [TServiceParams](/core/exports/TServiceParams).

## 🛠️ Utilities

### 🏠 Rooms & scenes

Create [rooms](/automation/rooms) that reflect their real world counterparts. Coordinate groups of entities as scenes, and other high level operations.

### 🔧 Active Management

- [Aggressive Scenes](/automation/aggressive-scenes)
- [Managed Switch](/automation/managed-switch)

### 💡 Circadian Lighting

- [Circadian](/automation/circadian)
- [Light Manager](/automation/light-manager)

By default for lights defined in room scenes, if no particular color is defined, the temperature will be automatically managed for you.

You can see the current light temperature as a dedicated sensor. Updates for light temperature are rate-limited with some configurable settings. This allows you to easily keep a natural feeling light temperature in your home, without overloading your install.

### 🧩 Advanced Pattern Matching

- [Sequence Matcher](/automation/sequence-matcher)

The library includes some utilities for translating a specific pattern of events in Home Assistant into callbacks. This can enable new layers of functionality remotes, allowing for creating automations based on button sequences.

### 🔧 Misc

- [Solar](/automation/solar)
- [Utils](/automation/utils)
