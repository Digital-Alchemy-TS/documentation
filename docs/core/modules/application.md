---
title: Application
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

## Bootstrapping

Once defined, an application module can be bootstrapped with optional configuration overrides:

```ts
await MY_APPLICATION.bootstrap();
```

### Multiple entrypoints

Separating `dev.main.mts` and `prod.main.mts` simplifies local development and production deployments:

- **Local dev (`dev.main.mts`)** can use more development friendly options and verbose logging configurations
- **Production (`prod.main.mts`)** can use more secure settings and provide additional context to logging systems

This split allows each environment to operate with different assumptions while sharing the same application definition.

### Extended example

In this setup, the `utils` module forwards logs to an external logging service like Datadog. Configuration passed into `bootstrap` includes:

- `CLOUD_LOGGER_API_KEY`: Enables the cloud logger at runtime.
- `loggerOptions.mergeData`: Tags each log line with static metadata (like environment, hostname, or service name), making it easier to filter and group logs in a dashboard.

```ts
await MY_APPLICATION.bootstrap({
  configuration: {
    boilerplate: { LOG_LEVEL: "info" },
    utils: {
      CLOUD_LOGGER_API_KEY: process.env.CLOUD_LOGGER_API_KEY,
    },
  },
  loggerOptions: {
    als: true,
    mergeData: {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),
      service: "special-microservice",
    },
  },
});
```


### `bootLibrariesFirst`

In typical usage, `bootstrap()` constructs all libraries and application services first, then runs lifecycle hooks (`onBootstrap`, then `onReady`) for everything in sync. This works well for most full-featured applications.

However, if you’re writing a **script, job runner, or anything lightweight**, it can be cumbersome to wait on external resources manually using lifecycle hooks.

To solve this, you can pass:

```ts
await MY_APPLICATION.bootstrap({ bootLibrariesFirst: true });
```

This changes the startup sequence:

1. **All libraries** are constructed first.
2. The `lifecycle.onBootstrap()` hook is awaited for each library.
3. **Then** application services are constructed.
4. Finally, `lifecycle.onReady()` is called across all modules.

This allows libraries (e.g., a database client, external API client, or telemetry pipeline) to be **fully initialized before your code runs**. That means you can safely start work in your own service logic without waiting or checking readiness.
