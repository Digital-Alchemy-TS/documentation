---
title: ⚙️ Install / Configure
sidebar_position: 0
---

[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/hass)](https://github.com/Digital-Alchemy-TS/hass)
[![codecov](https://codecov.io/gh/Digital-Alchemy-TS/hass/graph/badge.svg?token=LYUQ1FQ71D)](https://codecov.io/gh/Digital-Alchemy-TS/hass)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/hass)](https://www.npmjs.com/package/@digital-alchemy/hass)

**Runtime Support**: <img src="https://avatars.githubusercontent.com/u/108928776?s=48&v=4" alt="Bun" width="20"/> Bun,
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="20"/> Node.js (v20+)

##  Install Modules

`@digital-alchemy/hass` installs as a basic package, using [🧩 core](/docs/core/) to provide a wrapper around all the tools.

```bash
yarn add @digital-alchemy/core @digital-alchemy/hass
yarn add -D @digital-alchemy/type-writer
```

`type-writer` provides all of the relevant types for your 🏡 **Home Assistant** installation.
These are only for the editing experience & builds, they are **not** required to run the code.

### Add to project

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";

const MY_APP = CreateApplication({
  // import this project
  libraries: [LIB_HASS],
  // used to wire your services together
  name: "home_automation",
  services: {
    // 🏗️ add your services here
  }
});

// 🚀 start the app
await MY_APP.bootstrap();
```

### Set connection info

If you are running inside **Code Server** or inside **Code Runner** addon, then your application already has access to authentication info 🎉

All other setups need to provide connection details. Using a `.env` file is the recommended method -

```
HASS_BASE_URL=http://localhost:8123
HASS_TOKEN=YOUR LONG LIVED ACCESS TOKEN
```
> Tokens can be generated via your user profile > **Security** tab > **Long-lived access tokens**

## Next Steps

- [🎬 Type Writer](/docs/home-automation/hass/setup/type-writer/): capture your current **🏡 Home Assistant** state as type definitions
- Creating Services <sup>(docs todo)</sup>
- [🎭 Entity Proxies](/docs/home-automation/hass/entity-proxy): access entity state, listen for changes, and issue targeted service calls
- [📣 Call Proxy](/docs/home-automation/hass/call-proxy): access all the tools from the **Developer tools** > **ACTIONS** tab
