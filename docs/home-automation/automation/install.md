---
title: Install
sidebar_position: 0
---

| [NPM](https://www.npmjs.com/package/@digital-alchemy/automation) | [GitHub](https://github.com/Digital-Alchemy-TS/automation) |
| --- | --- |

## 💾 Install

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
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION, LIB_FASTIFY],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],
  name: "special_logic",
})
```
