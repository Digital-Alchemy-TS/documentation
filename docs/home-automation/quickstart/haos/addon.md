---
title: 📦 Deployments
---

[![Add to Home Assistant](https://img.shields.io/badge/Add%20DA%20addons%20to%20my-Home%20Assistant-41BDF5?logo=home-assistant&style=for-the-badge)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FDigital-Alchemy-TS%2Faddons)

This addon acts as a simple configurable execution container for applications based on Digital Alchemy.
The addon supports multiple runtimes, but `bun` is the recommended default for best compatibility

- Manual add link: https://github.com/Digital-Alchemy-TS/addons

![addon store](/img/addon_store.png)

## 🧲 Usage

![code runner options](/img/code_runner_options.png)

### 🏗️ Creating Builds

The **Code Runner** addon is intended to run builds of automation code, instead of acting as a dev server that runs code from `src/`.
Builds are stored in the `/share` folder, and are produced from inside the **Code Server** addon via package commands provided in the quickstart project.

```bash
yarn build:deploy
```

This command will:

1. Create a backup of the previous deploy
2. Remove old deployment `src/`, `node_modules/`, & related lockfiles
3. Update deployment `package.json`
4. Produce a new deployment `src/`

Dependencies are reinstalled at boot next boot using the addon to ensure proper compatibility.
This makes the first boot after a deploy take slightly longer to start

### 🧯 Rollback

In case your new build fails to live up to expectations, you roll back to the snapshot taken during the deployment process.

```bash
yarn rollback
```

> ⚠️ This will replace ALL data, including synapse database & `node_modules`

![example output](/img/rollback.png)

### 🔒 Providing Secrets

`@digital-alchemy/core` has a built in configuration loader suitable for providing secrets to your application.
A more complete description of the loader can be found in the [config documentation](https://docs.digital-alchemy.app/docs/core/configuration)

Your application will automatically have access to Home Assistant within the addon, but if you wish to integrate with other tools that require API keys, these can be provided by several mechanisms.

Using the example of setting the `TOKEN` configuration for your application (`config.home_automation.TOKEN` via `TServiceParams`):

#### `env` file

Applications will automatically look for a `.env` file as part of bootstrap.

> `/share/home_automation/.env`

```env
; {module_name}_{key}={value}
HOME_AUTOMATION_TOKEN=super_special_api_key
```
