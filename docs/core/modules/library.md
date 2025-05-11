---
title: Library
---

Library modules are intended to help organize and contain groupings of logic.

| name            | description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `configuration` | A mapping of configuration options this module declares            |
| `name`          | Application name — influences **configuration** & `TServiceParams` |
| `depends`  | An array of dependency libraries that must be loaded first         |
| `optionalDepends`  | An array of dependency libraries that must be loaded first (if provided by application module)         |
| `services`      | Object of service classes to register in the application           |
| `priorityInit`  | Optional array to control service initialization order             |

## Example Code

### Minimum

```typescript
import { CreateLibrary } from "@digital-alchemy/core";

import { APIService } from "./services/index.mts";

export const MY_LIB = CreateLibrary({
  name: "my_app",
  services: {
    api: APIService,
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
import { CreateLibrary } from "@digital-alchemy/core";
import { LIB_UTILS } from "@cool-org/logic";

import {
  DatabaseService,
  LoaderService,
  SpecialLogicService,
} from "./services/index.mts";

export const MY_APPLICATION = CreateLibrary({
  // Optional: declare configuration values used by services
  configuration: {
    DATABASE_URL: {
      type: "string",
      required: true,
    },
  },
  depends: [LIB_UTILS],
  name: "my_app",
  // Ensures database loads before loader
  priorityInit: ["database", "loader"],
  services: {
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
