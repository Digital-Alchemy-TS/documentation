## 📝 Description

The circadian extension is primarily an internal tool to provide additional functionality to scenes provided by [[Rooms|rooms]]. It creates a basic sensor entity to contain the target light temperature, and calculates a value using the sun position provided by [[Solar|automation.solar]] and a few configuration properties

# ⚙️ Configuration
- #Lifecycle/onPostConfig

> [!hint] Lights are still bound by the limits of the hardware
> The logic internal to [[Light Manager|light manager]] will respect those values over these limits in case of conflict

| Config                                | Description                                                            |
| ------------------------------------- | ---------------------------------------------------------------------- |
| #config/automation/CIRCADIAN_ENABLED  | If set to `false`, no entity will be created. Entire workflow disabled |
| #config/automation/CIRCADIAN_MAX_TEMP | Artificially set a max kelvin                                          |
| #config/automation/CIRCADIAN_MIN_TEMP | Artificially set a min kelvin                                          |
