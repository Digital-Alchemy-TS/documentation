---
title: Synapse
---
## 📚 Description

Welcome to `@digital-alchemy/synapse`!

This project builds on the functions provided by [hass](/hass/) to provide the ability to generate entities within your Home Assistant install.

🏗️ You are able to create entities from a wide variety of domains, ranging from helpers to real world device types.
Easily update state in response to events, or use internal triggers to manage for you!

## 🚀 Setup

Synapse has 2 major components to install in order to achieve proper functionality.

1. Custom component: [synapse-extension](/synapse-extension)
2. Typescript library: [install guide](/synapse/install)

[Configuration & fine tuning guide](/synapse/configuration)

**Related libraries:**

| Name | Note |
| --- | --- |
| [core](/core) | dependency |
| [hass](/hass) | dependency |
| [fastify](/fastify) | dependency |
| [automation](/automation) | downstream |

## 👩‍🔧 Basic Usage

Creating a new entity is easy! You can even attach to events inline with

```typescript
import { CronExpression, TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ scheduler, context, synapse, logger }: TServiceParams) {
  synapse.button({
    context,
    press: () => logger.info("that tickles!"),
    name: "Press me",
  });
}
```

See the [usage guide](/synapse/usage) for more details about managing configurations and events

### ♻️ State Restoration

> ⚠️ **IMPORTANT** State is not actively persisted anywhere with `synapse`, there is no guarantee that restarting your application will not result in partial/full loss of state.

When your application reboots, `synapse` will attempt to map data from entity state reported by Home Assistant back to the configuration variable in order to reload properly.
If the entity reports as `unavailable` at boot, the immediate next state will be used.

### 🔄 Automatic availability reporting

As part of the application lifecycle, a "coming online" / "going offline" message is emitted to Home Assistant to help manage entity availability.
The application will also emit a regular heartbeat, which will cause the entities to automatically go offline after a short time if it goes missing

## 📜 Supported Domains

| Domain                 | Verified |
|------------------------|----------|
| [Binary Sensor](https://developers.home-assistant.io/docs/core/entity/binary-sensor)        | *        |
| [Button](https://developers.home-assistant.io/docs/core/entity/button)               | *        |
| [Date](https://developers.home-assistant.io/docs/core/entity/date)                 | *        |
| [Datetime](https://developers.home-assistant.io/docs/core/entity/datetime)             | *        |
| [Lock](https://developers.home-assistant.io/docs/core/entity/lock)                 | *        |
| [Number](https://developers.home-assistant.io/docs/core/entity/number)               | *        |
| [Scene](https://developers.home-assistant.io/docs/core/entity/scene)                | *        |
| [Select](https://developers.home-assistant.io/docs/core/entity/select)               | *        |
| [Switch](https://developers.home-assistant.io/docs/core/entity/switch)               | *        |
| [Text](https://developers.home-assistant.io/docs/core/entity/text)                 | *        |
| [Time](https://developers.home-assistant.io/docs/core/entity/time)                 | *        |
| [Alarm Control Panel](https://developers.home-assistant.io/docs/core/entity/alarm-control-panel)  |          |
| [Camera](https://developers.home-assistant.io/docs/core/entity/camera)               |          |
| [Climate](https://developers.home-assistant.io/docs/core/entity/climate)              |          |
| [Cover](https://developers.home-assistant.io/docs/core/entity/cover)                |          |
| [Fan](https://developers.home-assistant.io/docs/core/entity/fan)                  |          |
| [Humidifier](https://developers.home-assistant.io/docs/core/entity/humidifier)           |          |
| [Image](https://developers.home-assistant.io/docs/core/entity/image)                |          |
| [Lawn Mower](https://developers.home-assistant.io/docs/core/entity/lawn-mower)           |          |
| [Light](https://developers.home-assistant.io/docs/core/entity/light)                |          |
| [Media Player](https://developers.home-assistant.io/docs/core/entity/media-player)         |          |
| [Notify](https://developers.home-assistant.io/docs/core/entity/notify)               |          |
| [Remote](https://developers.home-assistant.io/docs/core/entity/remote)               |          |
| [Sensor](https://developers.home-assistant.io/docs/core/entity/sensor)               |          |
| [Siren](https://developers.home-assistant.io/docs/core/entity/siren)                |          |
| [Todo List](https://developers.home-assistant.io/docs/core/entity/todo-list)            |          |
| [Update](https://developers.home-assistant.io/docs/core/entity/update)               |          |
| [Vacuum](https://developers.home-assistant.io/docs/core/entity/vacuum)               |          |
| [Valve](https://developers.home-assistant.io/docs/core/entity/valve)                |          |
| [Water Heater](https://developers.home-assistant.io/docs/core/entity/water-heater)         |          |
