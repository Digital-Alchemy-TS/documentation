---
title: Synapse Installation
---
## 💾 Install

> **Attention**:
> Depends on  [@digital-alchemy/hass](/hass/) and the [synapse custom component](/synapse-extension)

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/synapse
```

> **Add to code**

```typescript
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS, LIB_SYNAPSE],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS, LIB_SYNAPSE],
  name: "special_logic",
})
```

🎉 Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `synapse` on [TServiceParams](/core/exports/TServiceParams).

## ⚙️ Configure

See [configuration guide](./configuration)

## 🌐 HTTP

In order to facilitate some of the initial setup & discovery features in Home Assistant, `synapse` has a HTTP dependency.
See [fastify](/fastify) documentation for notes on how to configure / add your own routes.

Applications will use port `3000` by default.
