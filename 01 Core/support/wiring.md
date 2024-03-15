## 📚 Description

The wiring module is responsible for defining the structure of your application and ensuring all your code runs in the correct order. Code is divided up into modules based on purpose and is referred to as **libraries** or **applications**. They are largely the same thing, with the meaningful difference being that applications can be bootstrapped and there may be only 1 of them.

## 🔠 Types

As part of importing modules, they will also augment onto a global #LoadedModules interface. A collection of utility types will process the definitions and use this to provide accurate definitions of all services & configurations as part of #TServiceParams.

Block comments placed on keys will be carried through into service parameters as tsdoc comments.

## 🏛 CreateLibrary

> [!example] Example library creation

```typescript
import { CreateLibrary } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

import { Utils } from "./extensions";

export const LIB_AUTOMATION = CreateLibrary({
  configuration: {
    // ...Configurations
  },
  depends: [LIB_HASS, LIB_SYNAPSE],
  name: "automation",
  // light depends circadian
  priorityInit: ["utils"],
  services: {
    // ...more services

    /**
     * Helper functions
     */
    utils: Utils,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    /**
     * higher level automation tools
     */
    automation: typeof LIB_AUTOMATION;
  }
}
```

> [!info] For more details on the `configuration` block, see [[configuration|configuration]]

### 📦 `depends`

- #Feature/core/Depends

This block contains a list of all libraries this one depends on. Providing items in this array will:
- add that library to the #TServiceParams type definitions so they can be used internally
- set this library up to only be loaded after dependency libraries are loaded

> [!attention] applications must list all dependencies explicitly

Bootstrap will ensure the application explicitly loads each of these libraries and will defer loading this one until the referenced libraries are loaded first.

### 🏷 `name`

> [!attention] Name for the library, must match the key used in #LoadedModules

A module's name affects:
- where the config system sources data from
- log context
This name affects the configuration system, log contexts, and the key used in #TServiceParams.

> [!example] `name` in action

```typescript
export const LIB_EXAMPLE = CreateLibrary({
  //  (A) v these (B) ^
  name: "thingy",
  service: { foo: Foo },
  config: { EXAMPLE: { type: "string", default: "bar" } }
});

// must match
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    // v (A) these (B) v
    thingy: typeof LIB_EXAMPLE;
  }
}

// will be used to define
function Foo({ thingy, config, logger }: TServiceParams) {
  //        these ^ + v
  logger.info(config.thingy.EXAMPLE); // "bar"
}
```

### ⏳ priorityInit

- #Feature/core/PriorityInit

This list defines a loading order for services. Some configurations of code may require guaranteeing a particular service is loaded before another one; this array does that.

Services listed in the array are loaded first, in the provided order. Those not listed will be loaded next, in no guaranteed order.

## 🚀 CreateApplication

> [!example] #Usage-Example/core/create_application

```typescript
export const HOME_AUTOMATION = CreateApplication({
  configuration: {},
  libraries: [
    LIB_HASS,
    LIB_SYNAPSE,
    LIB_AUTOMATION,
  ],
  name: "home_automation",
  priorityInit: [ ... ],
  services: {
    ... services
  },
});
```

The structure is largely the same, with a few notable differences.

### 🎬 Bootstrap

See the dedicated section below for more details.

### 📚 `libraries`

- #Feature/Library

Applications must declare all library dependencies they use, explicitly. This includes all dependency libraries for libraries they import, even if they are not directly consumed within the application.

The version that is provided by the application in its `libraries` array is the one that will be used for runtime. If a library was declared with a different version of code (including `core`), those will NOT be used.

## ⚙️ Bootstrap

> [!tldr] #Feature/core/Bootstrap
> - #Feature/core/Logging
> - #Feature/core/Metrics
> - #Feature/core/Configuration

The major capability of applications to distinguish from libraries is the ability to bootstrap. This can be accomplished by calling the `.bootstrap` method attached to the application object. 

`Bootstrap` accepts several parameters to affect how the application starts.

| Property             | Description |
| -------------------- | ----------- |
| `configuration`      | Provide an alternate set of default configuration variables, overriding project-level defaults. |
| `customLogger`       | Use your logger instead of the default built-in one. |
| `handleGlobalErrors` | Should the library handle errors that bubble up to the global context? <br> - Log error <br> - Call `app.teardown()` <br> - Reboot |
| `showExtraBootStats` | When bootstrap completes, log some statistics about what happened. If you are experiencing long boot times, this might help you figure out why. |

The promise for the `.bootstrap` method will resolve when all startup lifecycle events have been completed.

### 🔄 Application Lifecycle

- #TServiceParams/lifecycle
- #Feature/core/Lifecycle

| Lifecycle Event | Type | Description | Example Use |
| --------------- | ---- | ----------- | ----------- |
| construction | `n/a` | An informal phase, describes the time when services are building their return output. Code should be limited to general configuration & wiring. | Code definitions & function wiring |
| `onPreInit`<br>#Lifecycle/onPreInit | startup | Ran prior to gathering user configuration. Frequently used with alternate application flows. | 1. check for `--help` flag<br>2. print configuration info<br>3. exit |
| (configure) | `n/a` | When the [[configuration]] does its processing to load user configurations. | |
| `onPostConfig`<br>#Lifecycle/onPostConfig | startup | User configs are populated into the library, libraries & applications can start utilizing that information to further self-configure / initialize dependencies. | Create a reference to an external library (ex: `fastify`) |
| `onBootstrap`<br>#Lifecycle/onBootstrap | startup | Configured libraries are available, and can be interacted with. | Perform wiring actions with that library (ex: add routes) |
| `onReady`<br>#Lifecycle/onReady | startup | Last chance to perform work before the application is officially "running". | Start servers / listen to ports / emit "hello world" messages to connected services |
| (running) | `n/a` | | |
| `onShutdownStart`<br>#Lifecycle/onShutdownStart | shutdown | The application has received a request to shut down. | Stop servers, save caches, emit goodbye messages |
| `onShutdownComplete`<br>#Lifecycle/onShutdownComplete | shutdown | Last second to do something before the process exits (or the test completes). | Log a goodbye message that shows the total uptime |

#### 🎖 With priorities

> [!example] #Usage-Example/core/lifecycle

Callbacks for lifecycle events have no guaranteed order for when they run relative to each other (within the same event), unless explicitly provided an order.

```typescript
function MyService({ logger, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    logger.info("I happen whenever");
  });
  lifecycle.onBootstrap(() => {
    logger.info("I happen early");
  }, 1);
  lifecycle.onBootstrap(() => {
    logger.info("Higher priority is more first-er");
  }, 2);
}
```
> [!tip] If you attach a callback to a lifecycle event after it already occurred, the callback will be run immediately
> This can be used as an "at least this far in the startup process" guarantee for code

The **"ready"** state may have some asterisks depending on the particular library. Some libraries may provide a separate `onConnect` type event for it's workflows, which may have different implications than a basic `onReady` lifecycle event

## 🛑 Teardown

The opposite workflow from the bootstrap. Clean up any resources, emit some "going offline" messages, flush caches, etc. The library will automatically listen for `SIGTERM`, as well as a few other events, in order to determine a proper time to run this flow.