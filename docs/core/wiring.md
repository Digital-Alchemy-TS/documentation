---
title: Wiring
---

## 📚 Description

The wiring module is responsible for defining the structure of your application and ensuring all your code runs in the correct order. Code is divided up into modules based on purpose and is referred to as **libraries** or **applications**. They are largely the same thing, with the meaningful difference being that applications can be bootstrapped and there may be only 1 of them.

## 🔠 Types

As part of importing modules, they will also augment onto a global [LoadedModules](/docs/core/exports/LoadedModules) interface. A collection of utility types will process the definitions and use this to provide accurate definitions of all services & configurations as part of [TServiceParams](/docs/core/exports/TServiceParams).

Block comments placed on keys will be carried through into service parameters as tsdoc comments.

## 🏛 CreateLibrary

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

> For more details on the `configuration` block, see [configuration](/docs/core/configuration)

### 📦 `depends`

This block contains a list of all libraries this one depends on. Providing items in this array will:

- add that library to the [TServiceParams](/docs/core/exports/TServiceParams) type definitions so they can be used internally
- set this library up to only be loaded after dependency libraries are loaded

> **Attention**: applications must list all dependencies explicitly

Bootstrap will ensure the application explicitly loads each of these libraries and will defer loading this one until the referenced libraries are loaded first.

### 🏷 `name`

> **Attention**: Name for the library, must match the key used in [LoadedModules](/docs/core/exports/LoadedModules)

A module's name affects:

- where the config system sources data from
- log context

This name affects the configuration system, log contexts, and the key used in [TServiceParams](/docs/core/exports/TServiceParams).

> Choose your name wisely

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

This list defines a loading order for services. Some configurations of code may require guaranteeing a particular service is loaded before another one; this array does that.

Services listed in the array are loaded first, in the provided order. Those not listed will be loaded next, in no guaranteed order.

## 🚀 CreateApplication

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

### 📚 Libraries

Applications must declare all library dependencies they use, explicitly. This includes all dependency libraries for libraries they import, even if they are not directly consumed within the application.

The version that is provided by the application in its `libraries` array is the one that will be used for runtime. If a library was declared with a different version of code (including `core`), those will NOT be used.

## ⚙️ Bootstrap

The major capability of applications to distinguish from libraries is the ability to bootstrap. This can be accomplished by calling the `.bootstrap` method attached to the application object.

`Bootstrap` accepts several parameters to affect how the application starts.

| Property                 | Description                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `configuration`      | Provide an alternate set of default [Configuration](/docs/core/configuration) variables, overriding project-level defaults.                                             |
| `customLogger`       | Use your logger instead of the default [built in one](/docs/core/logger).                                                                                |
| `handleGlobalErrors`     | Should the library handle errors that bubble up to the global context?            |
| `showExtraBootStats` | When bootstrap completes, log some statistics about what happened. If you are experiencing long boot times, this might help you figure out why. |

The promise for the `.bootstrap` method will resolve when all startup lifecycle events have been completed.

### [Lifecycle](/docs/core/lifecycle)

The application lifecycle is a key part to the way applications bootstrap.

## 🛑 Teardown

The opposite workflow from the bootstrap. Clean up any resources, emit some "going offline" messages, flush caches, etc. The library will automatically listen for `SIGTERM`, as well as a few other events, in order to determine a proper time to run this flow.
