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
The is intended to run from inside of a [Local Addon](/docs/home-automation/quickstart/automation-quickstart/addon), and many workflows have been fined tuned for the specific use case.

> 🦺 Docker based setups and those wanting to run code remotely should use the [Automation Standalone](https://github.com/Digital-Alchemy-TS/automation-standalone) project.

## 🚀 Setup

Within the **Code Server Addon**:

1. **Open a terminal**
  - Press **Ctrl-Shift-\`** (default keybind) to open a terminal, or go through `Menu` > `Terminal` > `New Terminal`.
2. **Execute the command**

```bash
curl -fsSL https://setup.digital-alchemy.app -o setup.sh; bash setup.sh
```

This command will:

- Download [setup script](https://raw.githubusercontent.com/Digital-Alchemy-TS/automation-quickstart/main/scripts/setup.sh) & run it
- Install NodeJS on your system
- Clone this repository
- Set up type definitions
- Provide next steps

<ReactPlayer playing controls url='/haos_quickstart.mp4' playing={false} />


## ⚒️ Workspace Management

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
| **`develop`** | ⏩ Run the development server<br />**Not intended for long term deployments!** |
| **`develop:watch`** | 👀 Run the development server<br />**Automatically restart server on code changes** |
| **`build:deploy`** | 🏗️ Create a build of your code in the `/share/digital_alchemy/` folder<br />**Addon has been set up to run from here** |
| **`type-writer`** | 🖨️ Rebuild custom type definitions for Home Assistant<br />**Run any time you modify your setup for more accurate definitions** |
