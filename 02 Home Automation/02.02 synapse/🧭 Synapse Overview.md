## 📚 Description

- #LoadedModules
- #TServiceParams/synapse
- #config/synapse

Welcome to `@digital-alchemy/synapse`!

This project builds on the functions provided by [[🧭 Hass Overview|@digital-alchemy/hass]] to provide the ability to generate entities within your Home Assistant install. With the help of a [custom component](https://github.com/Digital-Alchemy-TS/synapse-extension), you can gate logic behind switches, report states with sensors, attach functions to buttons, and more!

## ⚙️ Install

You can install the custom component through HACS. See the repo for more detailed install instructions [[🧭 Synapse Extension Overview|here]]

Creating new entities with the library is easy! The library will automatically handle communication with Home Assistant, reporting values, and attaching callbacks.

> [!example] #Usage-Example/synapse/create_entities

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

> [!caution] Names should be unique per domain!

### 🔄 Automatic availability reporting

- #Lifecycle/onPreShutdown

A `binary_sensor.{app_name}_online` will be created and managed by the extension. This binary sensor will display the connected state of your application and is always available. All other entities owned by this application will have their `availability` state tied to the online state.

When your application disconnects, it emits a "going offline" message to automatically flag entities. Applications also emit a heartbeat that the custom component uses to identify more sudden failures.

### 🔁 Reloading in Home Assistant

By default, applications don't automatically send their current list of entities to Home Assistant. To trigger an update/resync with your application and the custom component, use the `reload` button.

![[reload.png]]

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

- #config/synapse/ANNOUNCE_AT_CONNECT
Instead of waiting for the reload button to be clicked to gather new entities, your application will automatically send them every time it connects to the socket.

This can lead to odd interactions in edge cases, `false` by default.

- #config/synapse/APPLICATION_IDENTIFIER
Change the identifier your app uses to communicate with the [[🧭 Synapse Extension Overview|extension]] as.

- #config/synapse/EMIT_HEARTBEAT
Emit regular heartbeats to keep the entities flagged as available.