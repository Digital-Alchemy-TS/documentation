---
tags:
aliases:
  - Synapse
---
## 📚 Description

Welcome to `@digital-alchemy/synapse`!

This project builds on the functions provided by [hass](/home-automation/hass/) to provide the ability to generate entities within your Home Assistant install. With the help of a [custom component](https://github.com/Digital-Alchemy-TS/synapse-extension), you can gate logic behind switches, report states with sensors, attach functions to buttons, and more!

- [Changelog](/home-automation/synapse/changelog/0.3.x)

## 💾 Install

> **Attention**:
> Depends on  [@digital-alchemy/hass](/home-automation/hass/) and the [synapse custom component](/home-automation/synapse-extension)

Add as a dependency, and add to your imports. Nice and easy
```bash
npm i @digital-alchemy/synapse
```
**Add to code**
```typescript
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS, LIB_SYNAPSE],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS, LIB_SYNAPSE],
  name: "special_logic",
})
```
> 🎉
> Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `synapse` on [TServiceParams](/core/exports/TServiceParams).

### Usage

> Creating new entities with the library is easy! The library will automatically handle communication with Home Assistant, reporting values, and attaching callbacks.

```typescript
import { CronExpression, TServiceParams } from "@digital-alchemy/core";
import { faker } from "@faker-js/faker";

export function Example({ scheduler, context, synapse }: TServiceParams) {
  // Create a new switch entity
  const useHacker = synapse.switch({ context, name: "Use hacker phrase" });
  // Create a new sensor entity
  const sensor = synapse.sensor({ context, name: "Current catchphrase" });

  // Create a new phrase
  // Taking into consideration the current state of the switch
  const regenerate = () => {
    sensor.state =
      useHacker.state === "on"
        ? faker.hacker.phrase()
        : faker.company.catchPhrase();
  };

  // Update sensor every 10 minutes
  scheduler.cron({
    exec: regenerate,
    schedule: CronExpression.EVERY_10_MINUTES,
  });

  // Provide button for immediate updates
  synapse.button({
    context,
    exec: regenerate,
    name: "Update phrase",
  });
}
```

> **Caution**:
> Names should be unique per domain!

### 🔄 Automatic availability reporting

- [onPreShutdown](/core/lifecycle/onPreShutdown)

A `binary_sensor.{app_name}_online` will be created and managed by the extension. This binary sensor will display the connected state of your application and is always available. All other entities owned by this application will have their `availability` state tied to the online state.

When your application disconnects, it emits a "going offline" message to automatically flag entities. Applications also emit a heartbeat that the custom component uses to identify more sudden failures.

### 🔁 Reloading in Home Assistant

By default, applications don't automatically send their current list of entities to Home Assistant. To trigger an update/resync with your application and the custom component, use the `reload` button.

![reload](/img/reload.png)

## 📜 Supported Domains

Current support includes

| Domain          | Notes                                                         |
| --------------- | ------------------------------------------------------------- |
| `binary_sensor` | Reports an `on`/`off` state, not much else                    |
| `button`        | Create a quick callback to some code on your dashboard        |
| `sensor`        | Report `string`/`number`/`date` states, as well as attributes |
| `switch`        | Create virtual switches to gate logic with                    |
| `scene`         | Slightly different buttons, bring your own scene setting logic|

## ⚙️ Configuration

- [ANNOUNCE_AT_CONNECT](/home-automation/synapse/config/ANNOUNCE_AT_CONNECT)
Instead of waiting for the reload button to be clicked to gather new entities, your application will automatically send them every time it connects to the socket.

This can lead to odd interactions in edge cases, `false` by default.

- [APPLICATION_IDENTIFIER](/home-automation/synapse/config/APPLICATION_IDENTIFIER)
Change the identifier your app uses to communicate with the [extension](/home-automation/synapse-extension) as.

- [EMIT_HEARTBEAT](/home-automation/synapse/config/EMIT_HEARTBEAT)
Emit regular heartbeats to keep the entities flagged as available.
