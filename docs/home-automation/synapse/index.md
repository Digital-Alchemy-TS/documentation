---
title: 🧠 Synapse
sidebar_position: 2
authors: [zoe-codez]
---
## 📚 Description

Welcome to `@digital-alchemy/synapse`!

This project builds on the functions provided by [hass](/hass/) to provide the ability to generate entities within your Home Assistant install.

🏗️ You are able to create entities from a wide variety of domains, ranging from helpers to real world device types.
Easily update state in response to events, or use internal triggers to manage for you!

## 🚀 Setup

Synapse has 2 major components to install in order to achieve proper functionality.

1. Custom component: [synapse-extension](/docs/home-automation/synapse//extension)
2. Typescript library: [install guide](/docs/home-automation/synapse//install)

[Configuration & fine tuning guide](/docs/home-automation/synapse//configuration)

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

See the [usage guide](/docs/home-automation/synapse//usage) for more details about managing configurations and events

### ♻️ State Restoration

> ⚠️ **IMPORTANT** State is not actively persisted anywhere with `synapse`, there is no guarantee that restarting your application will not result in partial/full loss of state.

When your application reboots, `synapse` will attempt to map data from entity state reported by Home Assistant back to the configuration variable in order to reload properly.
If the entity reports as `unavailable` at boot, the immediate next state will be used.

### 🔄 Automatic availability reporting

As part of the application lifecycle, a "coming online" / "going offline" message is emitted to Home Assistant to help manage entity availability.
The application will also emit a regular heartbeat, which will cause the entities to automatically go offline after a short time if it goes missing
