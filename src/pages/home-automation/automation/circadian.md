---
tags: []
---
## 📝 Description

The circadian extension is primarily an internal tool to provide additional functionality to scenes provided by [rooms](/home-automation/automation/rooms). It creates a basic sensor entity to contain the target light temperature, and calculates a value using the sun position provided by [automation.solar](/home-automation/automation/solar) and a few configuration properties

# ⚙️ Configuration

> **Hint**: Lights are still bound by the limits of the hardware
> The logic internal to [light manager](/home-automation/automation/light-manager) will respect those values over these limits in case of conflict

- [CIRCADIAN_ENABLED](/home-automation/automation/config/CIRCADIAN_ENABLED)
- [CIRCADIAN_MAX_TEMP](/home-automation/automation/config/CIRCADIAN_MAX_TEMP)
- [CIRCADIAN_MIN_TEMP](/home-automation/automation/config/CIRCADIAN_MIN_TEMP)
