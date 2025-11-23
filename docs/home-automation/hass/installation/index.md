---
title: Installation
id: hass-install
sidebar_position: 1
---

`@digital-alchemy/hass` installs as a basic dependency, but should always be paired with the type-writer script for development.

```bash
yarn add @digital-alchemy/hass

# install as dev dependency
yarn add -D @digital-alchemy/type-writer
```

## Configuration

### Running inside Home Assistant

If you are running your code within Home Assistant:
- via Code Runner addon
- via Code editor addon
- similar

You are usually do not additional configuration.
Basic connection details are provided by Home Assistant and are automatically used by the library.

### Running external

If your code is connecting to Home Assistant from another location

- dev machine
- docker container
- some other deployment method

A `TOKEN` & `BASE_URL` configuration is needed

> Example `.env` file for project
```
HASS_BASE_URL=http://localhost:8123
HASS_TOKEN=<long lived access token>
```

## Configure Types

After your have your configuration defined for the project, you will need to run the type-writer script to set up type definitions for your project

## Importing into code

### Modules

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";

export const HOME_AUTOMATION = CreateApplication({
  name: "home_automation",
  libraries: [LIB_HASS],
  //          ^^^^^^^^ add to your libraries array
});
```

### Services

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ hass }: TServiceParams) {
  const entity = hass.refBy.id("sensor.example_sensor");
}
```
