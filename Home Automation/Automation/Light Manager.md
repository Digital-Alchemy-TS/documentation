---
tags: []
---

## 📝 Description

The light manager is an internal utility, intended to support [[Rooms|rooms]] as they manipulate lights.

## 💡 Circadian Mode Lights

If lights aren't flagged as being in a particular color, then the light manager will work to manage the lights in circadian mode. As the target changes, the lights will have their current target temperature changed. 

This is intended to work as a continual process, updating a set number of entities at once at a constant rate. 

- [[CIRCADIAN_DIFF_THRESHOLD]]
If the current temperature of the light exceeds this threshold, then it will be queued for update.

- [[CIRCADIAN_RATE]]
How many entities to attempt to update at once. This includes device communication time, and an artificial throttle rate.

- [[CIRCADIAN_THROTTLE]]
Wait a little bit longer before moving on to the next entity. Helps keep the load on home assistant.


### 📐 Design note

> [!warning] The default values are tight already.
> Lower is not better.

A non-obvious effect of decreasing the diff threshold is increased `light.turn_on` calls. By increasing the rate at which these happen, you will experience more situations where a `turn_off` command as a result of a scene set (or similar) will conflict with the `turn_on` used to change the temperature.

This situation self-corrects via [[Aggressive Scenes]], but the experience is less than ideal.