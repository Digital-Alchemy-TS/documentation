---
aliases:
  - /Blog/01
---
> [!success]
> You got the [[Automation Quickstart Overview|quickstart]] project pulled down, what now? 
 
## 👀 The sights

Before diving into the how to write, let's take a moment to go over the important but less fun parts of the project.
### 🏗 [package.json](https://github.com/Digital-Alchemy-TS/automation-quickstart/blob/main/package.json)

| The package.json contains useful workspace commands | [![[npm_scripts.png]]](../Quickstart/Automation/assets/npm_scripts.png) |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
You can run the commands from the command line if you are comfortable, or by using the buttons provided by VSCode. 

> [!faq]
Don't see the panel? 
> - Make sure the `NPM Scripts` option is checked.
> - Sometimes VSCode may not make the panel visible until you open `package.json`
### 📁 [scripts/](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/scripts)
This folder contains helper scripts for managing your workspace, and is utilized by the various commands in `package.json`. Re-running the setup script will upgrade the provided scripts with the newest version from the [[Automation Quickstart Overview|quickstart]] repo. The most important one is the `environment.sh`, which is used to managed the NodeJS environment 

> [!example] #Usage-Example/automation-quickstart
> Using the script to fix your environment, from the project root

```bash
./scripts/environment.sh
```

### 📁 [addon/](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/addon)
This is your [[Addon|code runner addon]], the source is provided as part of the project so you are able to tune the capabilities to your specific needs. By default, it is set up in a very minimal capacity. You are able to add incoming ports, ingress urls for dashboards, and more as part of the config file.

### 💻 Code
You can find your project code under [`src/`](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/src).
#### 🧾 main.ts

This file contains all the wiring for your application. You can define new configurations, import libraries, and attach your service functions so they run. Logic is **NOT SUPPOSED TO GO HERE**

It is structured in 3 parts:
##### Application Definition

Below is the most important items for defining your application, see the type definitions in your editor or [[Wiring|wiring docs]] for more details

| Property        | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configuration` | Declare variables you would like the [[Configuration\|config]] loader to collect values for                                                                                                                 |
| `libraries`     | An array of additional libraries to load into your application. These may be provided in any order<br><br>Adding to this array will add more properties to [[TServiceParams]] for use in your service files |
| `name`          | This value defines the property in [[TServiceParams]] that your service will attach to, as well as the name of the configuration file that will be used                                                     |
| `services`      | A mapping of **context name** to service definitions                                                                                                                                                        |
| `priorityInit`  | Forces a provided construction order for your services. Services not in the list will be built after the list is completed                                                                                  |
> [!example] #Usage-Example/core
> An example of a basic application definition, loading 3 additional services

The context name used in the service definition is for your own reference, and may use any standard for declaring services that works for you. 

```typescript
import { CreateApplication } from "@digital-alchemy/core";

import { EntityList } from "./entity-list";
import { HelperFile } from "./helper";
import { Testing } from "./testing";

const SUPER_AWESOME_APP = CreateApplication({
  name: "my_super_awesome_app",
  priorityInit: ["helper", "EntityList"],
  services: {
    EntityList,
    Testing,
    helper: HelperFile,
    // ... add more of your service functions here
  },
});
```

For reference, here is an implementation `Testing` to show how accessing your services via [[TServiceParams]] works. 

> [!important]
> 1. Utilizing dashes in your project/service names is discouraged
> 2. Service function function definitions may be async
> 3. Limit service return types to **undefined**/**void**, **function**, or **object** types
> 4. Services are defined as: `functions` that take [[TServiceParams]] as the argument. Pretty simple

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function Example({ my_super_awesome_app, logger, lifecycle }: TServiceParams) {
  // these exist, based on the app definition above
  my_super_awesome_app.EntityList;
  my_super_awesome_app.Testing;
  my_super_awesome_app.helper;

  lifecycle.onReady(() => {
  // format -
  // {project name}.{service name}.{return object usage}
	  my_super_awesome_app.Testing.superAwesomeFunction();
  });
  
  return {
    superAwesomeFunction() {
	  logger.info("Running via service call");
    }
  }
}
```

##### Module Loading

> [!example] #Usage-Example/core 
> Loading type definitions for an application

The key you use for the loaded modules must match the application name. Typescript will flag the name in your application definition if they do not. This step is required to get the library to load your application into type definitions for your services to take advantage of.

```typescript
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_super_awesome_app: typeof SUPER_AWESOME_APP;
  }
}
```

##### Bootstrap

> [!example] #Usage-Example/core 
> 🥾 Kick things off!

This step functionally gets your application started. You may provide some properties in to influence the way your application boot, such as overriding some default config properties. **Use configuration files to store keys**

```typescript
setImmediate(
  async () =>
    await SUPER_AWESOME_APP.bootstrap({
      configuration: {
        boilerplate: { LOG_LEVEL: "debug" },
      },
    }),
);
```

## 🛠 Building an automation

Now that we have a foundation on **what is a service** / **how to wire them together**, let's build on that by building a basic automation. 

### 🌐 Connecting to Home Assistant

For this, we'll need to import the [[Hass Overview|hass]] library (see link for details on configuration), this comes installed and already set up if you used the [[Automation Quickstart Overview|quickstart]] script. 

```typescript
import { CreateApplication } from "@digital-alchemy/core";
// Import library definition
import { LIB_HASS } from "@digital-alchemy/hass";

const SUPER_AWESOME_APP = CreateApplication({
  // add to libraries
  libraries: [LIB_HASS],
  name: "my_super_awesome_app",
  // ...
});
```

> [!success]
> What changed:
> - your application will attempt to connect to home assistant during bootstrap
> - `hass` is added to [[TServiceParams]], providing you basic tools to interact with home assistant with

### 🤖 Creating logic

It's finally time! let's actually make the application do something productive! 

> [!example] #Usage-Example/hass 
> This is a basic service that will send notifications every 5 minutes as long as I am away from home, and the garage is open

```typescript
import { TServiceParams } from "@digital-alchemy/core";

// 5 MINUTES
const REPEAT_NOTIFICATION_INTERVAL = 1000 * 60 * 5;

export function GaragePester({ scheduler, logger, hass, internal }: TServiceParams) {
  const isHome = hass.entity.byId("binary_sensor.zoe_is_asleep");
  const garageIsOpen = hass.entity.byId("binary_sensor.garage_is_open");
  let stop: () => void;

  // UPDATE TRIGGER
  isHome.onUpdate((new_state, old_state) => {
    if (new_state.state === "off") {
      // am home, stop notifying and clean up
      if (stop) {
        logger.info("welcome back home!");
        stop();
        stop = undefined;
      }
      return;
    }
    if (old_state.state !== "off" || stop) {
      return;
    }
    
    // send a notification every 5 minutes
    // ex: "You left 20m ago with the garage open"
    const notifyingSince = new Date();
    stop = scheduler.interval({
      async exec() {
        logger.info("still a problem");
        // calculate a friendly string that describes how long
        const timeAgo = internal.utils.relativeDate(notifyingSince);

        // call the `notify.notify` service
        await hass.call.notify.notify({
          message: `You left ${timeAgo} with the garage open`,
          title: "Come back and close the garage!",
        });
      },
      interval: REPEAT_NOTIFICATION_INTERVAL,
    });
  });

  garageIsOpen.onUpdate(() => {
    // stop notifying if I remotely close the garage
    if (garageIsOpen.state === "off" && stop) {
      logger.info("stopping garage reminders");
      stop();
      stop = undefined;
    }
  });
}
```

### Creating schedules

#### Timers

> [!example] #Usage-Example/core 
> 
#### Solar

> [!example] #Usage-Example/core 


---
- #Blog
