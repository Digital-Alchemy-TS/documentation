---
tags: []
---
## 📚 Description

The `@digital-alchemy/hass` library provides some additional functionality that is more specialized.

## 🛡 Backup API

You can request your Home Assistant instance start a new backup using the commands at `hass.utils.backup`. Functions will block attempts to create a new backup while one is in progress, and will keep track of when yours completes.

## 🔧 Automatic configuration for supervised

If `HASSIO_TOKEN` or `SUPERVISOR_TOKEN` is detected as an environment variable (provided by Home Assistant for addons), then the library will update [[Configuration]] appropriately. Automatic values for [[Home Automation/Hass/config/BASE_URL|BASE_URL]] & [[Home Automation/Hass/config/TOKEN|TOKEN]]. Occurs [[onPreInit]]

## ✔️ Validate Configuration

> [!example] #Usage-Example/hass
> Want to quickly check if you defined your credentials in a valid way? Use [[VALIDATE_CONFIGURATION]]
```bash
npx src/main.ts --VALIDATE_CONFIGURATION
```

> [!tldr] What to expect 
> Some of the output variations you might encounter as a result of the script. Demonstrated using [[Type Writer Overview|type-writer]].

### ✅ Valid

![[validate_config_running.png]]

## ❌ Bad Token

![[validate_config_bad_token.png]]

### ❌ Bad Address

> Provided `http://127.0.0.1:8000` as URL, nothing is using that port.

![[validate_config_bad_address.png]]

### 🔐 SSL Error

> Provided address to invalid subdomain.

![[validate_config_bad_domain.png]]