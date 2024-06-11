---
title: 🚀 Install
sidebar_position: 0
---
## 🥡 Import Code

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/hass

# don't forget me!
npm i --save-dev @digital-alchemy/type-writer
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

## ⚙️ Basic Configuration

### 🤖 Supervised

If your code is running within a Home Assistant addon environment, it will automatically connect with no additional configuration needed.

### 🔧 Manual

For code running elsewhere, manual configuration is required. You will need a **Long Lived Access Token**, which can be generated on your user profile.

> Basic configuration to connect

**ini:**

```ini
[hass]
  BASE_URL=http://localhost:8123
  TOKEN=YOUR LONG LIVED ACCESS TOKEN
```

**.env:**

```env
HASS_BASE_URL=http://localhost:8123
HASS_TOKEN=YOUR LONG LIVED ACCESS TOKEN
```
