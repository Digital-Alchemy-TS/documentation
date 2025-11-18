---
title: "🔬 Beta Installation"
sidebar_position: 2
authors: [zoe-codez]
---

| [NPM](https://www.npmjs.com/package/@digital-alchemy/synapse) | [GitHub](https://github.com/Digital-Alchemy-TS/synapse) |
| --- | --- |

## 💾 Install

> **Attention**:
> Depends on  [@digital-alchemy/hass](/docs/home-automation/hass/) and the [synapse custom component](/docs/home-automation/synapse/extension)

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/synapse
```

> **Add to code**

```typescript
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

// 🏘️ applications
const MY_APP = CreateApplication({
  libraries: [LIB_HASS, LIB_SYNAPSE],
  ...
})

// 📚 libraries
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS, LIB_SYNAPSE],
  ...
})
```

## 📑 Register application

Once you have you application started, and have the extension installed within Home Assistant, connecting the two is a straightforward process.
From within Home Assistant, go to `+ ADD INTEGRATION` and select **Digital Alchemy**.

When you start the config flow, Home Assistant will emit a discovery request to gather details about all connected applications.
Then a list will be presented allowing you to select an application to register.

Once your application is registered, a few things will happen:
- A device will be created to represent your application and contain entities
- A "application is online" `binary_sensor` entity will be created
- New entities will be generated to match your app

See the [sync](/docs/home-automation/synapse/syncing) page for specifics about when and how state is synced.
