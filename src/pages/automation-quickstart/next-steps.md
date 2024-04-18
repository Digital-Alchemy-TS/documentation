---
aliases:
  - Next-Steps
---
> 🎉
> You got the [quickstart](/automation-quickstart) project pulled down, what what is this mess?

## 👀 The sights

Let's take a quick tour of the repo to

### 🏗 [package.json](https://github.com/Digital-Alchemy-TS/automation-quickstart/blob/main/package.json)

| The package.json contains useful workspace commands | [![npm_scripts](/img/npm_scripts.png)](/img/npm_scripts.png) |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
You can run the commands from the command line if you are comfortable, or by using the buttons provided by VSCode.

> **FAT**:
Don't see the panel?
> - Make sure the `NPM Scripts` option is checked.
> - Sometimes VSCode may not make the panel visible until you open `package.json`
### 📁 [scripts/](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/scripts)
This folder contains helper scripts for managing your workspace, and is utilized by the various commands in `package.json`. Re-running the setup script will upgrade the provided scripts with the newest version from the [quickstart](/automation-quickstart) repo. The most important one is the `environment.sh`, which is used to managed the NodeJS environment

```bash
./scripts/environment.sh
```

### 📁 [addon/](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/addon)
This is your [code runner addon](/automation-quickstart/addon), the source is provided as part of the project so you are able to tune the capabilities to your specific needs. By default, it is set up in a very minimal capacity. You are able to add incoming ports, ingress urls for dashboards, and more as part of the config file.

## 💻 Code
You can find your project code under [`src/`](https://github.com/Digital-Alchemy-TS/automation-quickstart/tree/main/src).
### 🛢 Service functions

Service functions are where all your logic goes. They have a relatively simple anatomy, a function that takes in [TServiceParams](/core/exports/TServiceParams) as it's argument. You can read more about the nuances [here](/core).
```typescript
function ServiceFunction({ logger }: TServiceParams) {
  logger.info("hello world");
}
```

These functions contain your logic, and can be wired together into larger applications. Your services are provided back to you as property in the input. If you want a complete list of what's available, this is a simple trick -

![whats_in_this](/img/whats_in_this.png)
### 🧾 main.ts

This file contains all the wiring for your application. You can define new configurations, import libraries, and attach your service functions so they run. Logic is **NOT SUPPOSED TO GO HERE**

It is structured in 3 parts:
#### Application Definition

Below is the most important items for defining your application, see the type definitions in your editor or [wiring docs](/core/wiring) for more details

| Property        | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configuration` | Declare variables you would like the [config](/core/configuration) loader to collect values for                                                                                                                 |
| `libraries`     | An array of additional libraries to load into your application. These may be provided in any order (**Adding to this array will add more properties to [TServiceParams](/core/exports/TServiceParams) for use in your service files**) |
| `name`          | This value defines the property in [TServiceParams](/core/exports/TServiceParams) that your service will attach to, as well as the name of the configuration file that will be used                                                     |
| `services`      | A mapping of **context name** to service definitions                                                                                                                                                        |
| `priorityInit`  | Forces a provided construction order for your services. Services not in the list will be built after the list is completed                                                                                  |
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

For reference, here is an implementation of `Testing` to show how accessing your services via [TServiceParams](/core/exports/TServiceParams) works.

> **Important**:
> 1. Utilizing dashes in your project/service names is discouraged
> 2. Service function function definitions may be async
> 3. Limit service return types to **undefined**/**void**, **function**, or **object** types
> 4. Services are defined as: `functions` that take [TServiceParams](/core/exports/TServiceParams) as the argument. Pretty simple

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

#### Module Loading

The key you use for the loaded modules must match the application name. Typescript will flag the name in your application definition if they do not. This step is required to get the library to load your application into type definitions for your services to take advantage of.

```typescript
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_super_awesome_app: typeof SUPER_AWESOME_APP;
  }
}
```

> **ERROR**:
> What happens when names don't align
>
> ![slowstart](/img/slowstart.png)

#### Bootstrap

This step functionally gets your application started. You may provide some properties in to influence the way your application boot, such as overriding some default config properties. **Do not put secrets/keys here**

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
