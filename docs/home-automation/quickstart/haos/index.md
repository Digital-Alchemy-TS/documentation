---
title: 🏠 HAOS
aliases:
  - Quickstart
  - Automation-Quickstart
  - blog/00
  - blog/Quickstart
---
import ReactPlayer from 'react-player'

Welcome to the **Digital Alchemy** Home Automation quickstart project!

This guide is built for [HAOS](https://developers.home-assistant.io/docs/operating-system/) & setups where the [Supervisor](https://developers.home-assistant.io/docs/supervisor/) is available.
The is intended to run from inside of an [addon](/docs/home-automation/quickstart/haos/addon), and many workflows have been fined tuned for the specific use case.

## 🚀 Setup

Within the **Code Server Addon**:

1. **Open a terminal**
  - Press **Ctrl-Shift-\`** (default keybind) to open a terminal, or go through `Menu` > `Terminal` > `New Terminal`.
2. **Execute the command**

```bash
curl -fsSL https://setup.digital-alchemy.app -o setup.sh; bash setup.sh
```

This command will:

- Download [setup script](https://raw.githubusercontent.com/Digital-Alchemy-TS/haos-template/main/scripts/setup.sh) & run it
- Install NodeJS on your system
- Clone this repository
- Set up type definitions
- Provide next steps

<ReactPlayer playing controls url='/haos_quickstart.mp4' playing={false} />


## ⚒️ Workspace Management

[![Add to Home Assistant](https://img.shields.io/badge/Add%20DA%20addons%20to%20my-Home%20Assistant-41BDF5?logo=home-assistant&style=for-the-badge)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FDigital-Alchemy-TS%2Faddons)

In order to help **Code Server** to keep `node` installed, you need to add a the following script as an `init_command` in the **Configuration** tab.

```bash
/config/home_automation/scripts/init.sh
```

![ui location](/img/init_command.png)

## 💻 Commands

Once your environment is set up, you can use provided commands from within the `package.json` to manage your workspace.

| NPM Command | Description |
| ---- | ---- |
| **`upgrade`** | ⏺️ Upgrade all `@digital-alchemy` dependencies<br />**Automatically runs `type-writer` afterwards** |
| **`dev`** | ⏩ Run the development server<br />**Not intended for long term deployments!** |
| **`watch`** | 👀 Run the development server<br />**Automatically restart server on code changes** |
| **`build`** | 🏗️ Create a build of your code in the `/share/digital_alchemy/` folder<br />**Addon has been set up to run from here** |
| **`type-writer`** | 🖨️ Rebuild custom type definitions for Home Assistant<br />**Run any time you modify your setup for more accurate definitions** |
