---
title: Applications
id: core-application
sidebar_position: 2
description: ""
---

Application modules initialize your app. They behave like libraries but support the following additional properties:

| name            | description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `configuration` | A mapping of configuration options this module declares            |
| `name`          | Application name — influences **configuration** & `TServiceParams` |
| `libraries`     | An array of dependency libraries your application should load      |
| `services`      | Object of service classes to register in the application           |
| `priorityInit`  | Optional array to control service initialization order             |

### Libraries

If a library in the `libraries` array declares dependencies, those must also be included in the `libraries` array of the application module.

The version of the dependency defined by the **application** module is the one used at runtime, overriding versions defined in libraries.

## Example Code

### Minimum

Only the application name and at least one service are required:

```typescript
import { CreateApplication } from "@digital-alchemy/core";

import { SpecialLogicService } from "./services/index.mts";

export const MY_APPLICATION = CreateApplication({
  name: "my_app",
  services: {
    logic: SpecialLogicService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    // key must match name
    my_app: typeof MY_APPLICATION;
  }
}
```

### Full

More advanced setup with libraries, configuration, and prioritized services:

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HTTP, LIB_UTILS } from "@cool-org/logic";

import {
  DatabaseService,
  LoaderService,
  SpecialLogicService,
} from "./services/index.mts";
import { ApplicationController } from "./controllers/index.mts";

export const MY_APPLICATION = CreateApplication({
  // Optional: declare configuration values used by services
  configuration: {
    DATABASE_URL: {
      type: "string",
      required: true,
    },
  },
  libraries: [LIB_HTTP, LIB_UTILS],
  name: "my_app",
  // Ensures database loads before loader
  priorityInit: ["database", "loader"],
  services: {
    ApplicationController,
    database: DatabaseService,
    loader: LoaderService,
    logic: SpecialLogicService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APPLICATION;
  }
}
```
