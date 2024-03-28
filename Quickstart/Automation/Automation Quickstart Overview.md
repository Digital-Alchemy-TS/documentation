---
aliases:
  - Quickstart
  - Automation-Quickstart
  - blog/00
  - blog/Quickstart
---
## 📘 Overview 

Welcome to the `@digital-alchemy` [[Home Automation Overview|Home Automation]] quickstart project!

This project is designed to work with **Supervised** and **HA OS** based installs, where **Addons** are supported. If you used a different installation method, you will need to make tweaks to the process.

These instructions assume that [Studio Code Server Addon](https://github.com/hassio-addons/addon-vscode) has been installed on your setup, serving as both editor and workspace management tool.

**Links!**
- [Github repo](https://github.com/Digital-Alchemy-TS/automation-quickstart)
- [Discord](https://discord.com/invite/mtWHk36upW)
- [[Automation Quickstart 0.3.x|Automation quickstart changelog]]

## 🚀 Setup

> [!note] 
> The below command works for:
> - Initial setup
> - Fixing a broken environment
> - Updating the `scripts` provided by quickstart repo with newer versions

Within the **Code Server Addon**:

1. Open a terminal
   - Press **Ctrl-Shift-\`** (default keybind) to open a terminal, or go through `Menu` > `Terminal` > `New Terminal`
2. Execute the command
```bash
curl -fsSL https://setup.digital-alchemy.app -o setup.sh; bash setup.sh
```
This script will:
- Install NodeJS on your system
- Pull down the [starter template](https://github.com/Digital-Alchemy-TS/automation-quickstart)
- Install all necessary dependencies
- Add the [[Addon|local code runner]] addon as a local addon

The final install step is for you to install the addon.
![[addon.png]]

> [!success]
> You are now able to run Typescript code on your Home Assistant instance! 🎉
> Check out the [[Next Steps|next steps guide]] for an orientation on the project you just set up
### 📺 In action

No sound orientation videos, for a bit of context on what things should look like when everything goes right.

> [!tldr] Tldw: Setup Process
> Speed run of the setup process, taking a break to run the code manually and in the background with the addon

![[zeroconf.mp4]]

> [!tldr] Tldw: Editing Experience
> Have your editor provide handy suggestions about your current setup as you type

![[intro.mp4]]

## ⚒️ Workspace Management

> [!warning] 
> The NodeJS environment within the Code Server addon does not survive reboots and may occasionally need to be set up again. 
> 

A script has been provided to restore your environment if something goes wrong.
```bash
./scripts/environment.sh
```
> [!tip] 
> Also accessible as a task within VSCode as part of the workspace. 
> Use `Tasks: Run Task` from the command palette to access

Once your environment is set up, you can use the commands in the `package.json` to manage your workspace further.

| NPM Command         | Description                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **`upgrade`**       | ⏺️ Upgrade all `package.json` dependencies<br>**Automatically runs `type-writer` afterwards**                                       |
| **`develop`**       | ⏩ Run the development server from within the `Code Server` addon<br>**Not intended for long term deployments!**                     |
| **`develop:watch`** | 👀 Run the development server in watch mode from within the `Code Server` addon<br>**Automatically restart server on code changes** |
| **`setup:addon`**   | 🔁 Reinstall the code runner addon. <br>**Uses name in `package.json` to determine install path**                                   |
| **`build`**         | 🔨 Create a build of your code in the `dist/` folder<br>**Reports all the errors in your workspace**                                |
| **`build:deploy`**  | 🏗️ Create a build of your code in the `deploy/` folder<br>**Addon has been set up to run from here**                               |
| **`lint`**          | 😱 Check your workspace for non-critical issues                                                                                     |
| **`lint:fix`**      | 🪛 Run `eslint --fix` to resolve minor issues                                                                                       |
| **`type-writer`**   | 🖨️ Rebuild custom type definitions for Home Assistant<br>**Run any time you modify your setup for more accurate definitions**      |

---
> [!todo]
> See [[Next Steps|next ]]

- #Blog
