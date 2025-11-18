---
title: 🧠 Synapse
sidebar_position: 2
authors: [zoe-codez]
---

The Digital Alchemy synapse project builds on top of the basic API calling functionality provided by [hass](/docs/home-automation/hass/) and provides bindings that allow you define your own services and entities within Home Assistant.

## 🚀 Setup

Synapse has 2 major components to install in order to achieve proper functionality.

1. Custom component: [synapse-extension](/docs/home-automation/synapse/extension)
2. Typescript library: [install guide](/docs/home-automation/synapse/install)

## 🗄️ Database Support

Synapse uses [Drizzle ORM](https://orm.drizzle.team/) to support multiple database types:

- **SQLite** (default) - Local file-based storage
- **PostgreSQL** - Production-ready relational database
- **MySQL** - Alternative relational database

Database configuration is handled through environment variables or application configuration. See the [configuration section](/docs/home-automation/synapse/usage/advanced#database-configuration) for details.

## 👩‍🔧 Basic Usage

Creating a new entity is easy! You can even attach to events inline with

```typescript
import { CronExpression, TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ context, synapse, logger }: TServiceParams) {
  synapse.button({
    context,
    press: () => logger.info("that tickles!"),
    name: "Press me",
  });

  const sensor = synapse.binary_sensor({
    context,
    // default state
    is_on: false
  });

  onSomeEvent(async () => {
    // runtime updates
    sensor.is_on = true;
    await sleep(1000);
    sensor.is_on = false;
  });
}
```

See the [usage guide](/docs/home-automation/synapse/usage) for more details about managing configurations and events

### 🔄 Automatic availability reporting

As part of the application lifecycle, a "coming online" / "going offline" message is emitted to Home Assistant to help manage entity availability.
The application will also emit a regular heartbeat, which will cause the entities to automatically go offline after a short time if something unexpected happens.
