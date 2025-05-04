---
title: Application
---

Applications modules provide an interface able to initialize your application.
Similar to libraries, they take the following arguments.

| name            | description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `configuration` | A mapping of configuration options this module declares          |
| `name`          | Application name influences **configuration** & `TServiceParams` |
| `libraries`     | An array of dependency libraries your application should load    |
| `services`      | An object containing all the services to load                    |
| `priorityInit`  | Manually set the construction order of your services             |

### Libraries

If an item in the `library` array includes dependency libraries, those must be explicitly included in the application module.

The version of the dependency defined by the **application** module is the one that gets used for runtime, overriding the version provided in the library.

## Example Code

### Minimum

The minimum you need is a name to load with, and some logic

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

Getting more complex with dependency libraries, configurations, and a more intricate service setup.

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
  configuration: {
    DATABASE_URL: {
      type: "string",
      required: true,
    },
  },
  libraries: [LIB_HTTP, LIB_UTILS],
  name: "my_app",
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

## Bootstrapping

Once the module is defined, it can be bootstrapped into a running application. It's as easy as -

```typescript
MY_APPLICATION.bootstrap();
```

### Options

The bootstrap command can contain overrides to the module defined configurations.
This makes it possible to set up several environment specific options.

> dev.main.mts

```typescript
import { MY_APPLICATION } from "./app.module.mts";

await MY_APPLICATION.bootstrap({
  configuration: {
    boilerplate: {
      LOG_LEVEL: "debug"
    },
    http: {
      CORS: false
    },
    my_app: {
      // set a
      DATABASE_URL: "postgresql://postgres@localhost:5432/postgres"
    }
  }
});
```

> prod.main.mts

```typescript
import { MY_APPLICATION } from "./app.module.mts";

await MY_APPLICATION.bootstrap({
  configuration: {
    boilerplate: {
      LOG_LEVEL: "info"
    },
    utils: {
      CLOUD_LOGGER_API_KEY: process.env.CLOUD_LOGGER_API_KEY
    }
  },
  loggerOptions: {
    als: true,
    mergeData: {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),
      service: "bedrock",
    }
  }
});
```
