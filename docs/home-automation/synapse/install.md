---
title: "🚀 Installation"
sidebar_position: 1
---
## 💾 Install

> **Attention**:
> Depends on  [@digital-alchemy/hass](/docs/home-automation/hass/) and the [synapse custom component](/docs/home-automation/synapse/extension)

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/synapse
```

> **Add to code**

```typescript
import { LIB_FASTIFY } from "@digital-alchemy/fastify-extension";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

// 🏘️ applications
const MY_APP = CreateApplication({
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_FASTIFY],
  ...
})

// 📚 libraries
export const MY_LIBRARY = CreateLibrary({
  // fastify does not need to be declared here
  depends: [LIB_HASS, LIB_SYNAPSE/*, LIB_FASTIFY*/],
  ...
})
```

## ⚙️ Configure

See [configuration guide](./configuration)

## 🌐 HTTP

In order to facilitate some of the initial setup & discovery features in Home Assistant, `synapse` has a HTTP dependency.
See [fastify](/docs/support/fastify/) documentation for notes on how to configure / add your own routes.

Applications will use port `3000` by default.
