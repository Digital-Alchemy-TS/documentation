---
title: Installation
id: synapse-install
sidebar_position: 1
---

> ⚠️ This library requires a custom component to be installed in side Home Assistant to operate

`@digital-alchemy/synapse` installs as a basic dependency, depending on `@digital-alchemy/hass` for it's ability to connect to Home Assistant.

```bash
yarn add @digital-alchemy/synapse
```

## Importing into code

### Modules

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import { LIB_HASS } from "@digital-alchemy/hass";

export const HOME_AUTOMATION = CreateApplication({
  name: "home_automation",
  libraries: [LIB_SYNAPSE, LIB_HASS],
  //          ^^^^^^^^ add to your libraries array
});
```

### Services

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ synapsem, context }: TServiceParams) {
  const sensor = synapse.sensor({
    context,
    name: "Magic Sensor"
  })
}
```

## Configuration Considerations

### Unique ID

The synapse integration can be set up with many apps connecting to a central Home Assistant instance.
In order to keep track of everything, each application requires a configuration property `METADATA_UNIQUE_ID`.

By default, this value is generated based on the `hostname` + folder path for where the code is running.

It is recommended that you create and hard code a `METADATA_UNIQUE_ID` property into the bootstrap command of your app so your app so it will always be a stable value.

```typescript
import { HOME_AUTOMATION } from "./application.module.mts";

HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      METADATA_UNIQUE_ID: "f4f75495-8928-4f8d-895b-22fbef47f549"
      // any unique value works ^^^^^^^^
    }
  }
})
```

### Pesistence

Entity state can change at runtime, but your application will occasionally need to restart.
In order to make sure your application restores in the same state that it shut down in, a database is required.

The `synapse` library has support for the following backends
- `SQLite` (default)
- `Postgres`
- `MySQL` / `MariaDB`

The default sqlite will store state in a file within your repository (you should `.gitignore`).

For a more seamless experience working with multiple environments, you should consider `postgresql` or `mysql` backends.
These both support multiple applications within a single database at the same time and have no issues with remote connections.

```
# valid values: sqlite | postgresql | mysql
SYNAPSE_DATABASE_TYPE=sqlite

# shared var: file path for sqlite, connection string for others
SYNAPSE_DATABASE_URL=file:./synapse_storage.sql
```
