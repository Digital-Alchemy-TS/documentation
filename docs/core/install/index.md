---
title: Installation
id: install
sidebar_position: 0
description: ""
---

Digital Alchemy installs as a basic npm package, which contains all of the basic application wiring and testing utilities.

```bash
yarn add @digital-alchemy/core
```

After installation, you are able to open a file and dive right in with creating your application.

## Building Applications

#### Services

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function MyFirstService({ logger, example_app }: TServiceParams) {
  logger.info("hello world");
}
```

#### Modules

```typescript
import { CreateAppplication } from "@digital-alchemy/core";
import { MyFirstService } from "./my.service.mts";

// Define the structure of your application
export const MY_APPLICATION = CreateApplication({
  name: "example_app",
  services: {
    my_service: MyFirstService
  }
});

// Enable type support for services
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    example_app: typeof MY_APPLICATION
  }
}
```

## Running your application

Digital-Alchemy is runtime agnostic, so specific instructions vary on your use situations.

- [deno](https://deno.land/manual) / [bun](https://bun.sh/docs) supported
- building with Typescript & running with node supported
- [tsx](https://github.com/esbuild-kit/tsx) based servers supported

All approachs will need an entrypoint file. It is best practice to keep this file separate from your module definitions, allowing for different entrypoints depending on your needs.

```
src/environments/main.mts
src/environments/production-main.mts
```

```typescript
import { MY_APPLICATION } from "../application.module.mts";

await MY_APPLICATION.bootstrap({
  configuration: {
    // entrypoint specific overrides
  }
});
```

```bash
npx tsx src/environments/main.mts
```

## Dependency Notes

### Day.JS

[dayjs](https://day.js.org/) is the preferred utility for date/time logic.
Digital Alchemy utilizes a few non-default plugins, which may not properly reflect by default in your editor.

Including this code somewhere in your project will resolve any missing types

```typescript
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import isBetween from "dayjs/plugin/isBetween.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(duration);
```

#### Docs

- [Duration](https://day.js.org/docs/en/plugin/duration)
- [isBetween](https://day.js.org/docs/en/plugin/is-between)
- [duration](https://day.js.org/docs/en/plugin/duration)
