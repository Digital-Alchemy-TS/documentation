---
tags: []
---
## 📝 Description

The circadian extension is primarily an internal tool to provide additional functionality to scenes provided by [[Rooms|rooms]]. It creates a basic sensor entity to contain the target light temperature, and calculates a value using the sun position provided by [[Solar|automation.solar]] and a few configuration properties

# ⚙️ Configuration

> [!hint] Lights are still bound by the limits of the hardware
> The logic internal to [[Light Manager|light manager]] will respect those values over these limits in case of conflict

- [[CIRCADIAN_ENABLED]]
- [[CIRCADIAN_MAX_TEMP]]
- [[CIRCADIAN_MIN_TEMP]]
