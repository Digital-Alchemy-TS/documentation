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

After installation, you are able to open a file and create your first service

> **NOTE**: Services are not runnable on their own, see Applications section for more details

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function MyFirstService({ logger }: TServiceParams) {
  logger.info("hello world");
}
```

## Dependency Notes

[dayjs](https://day.js.org/) is the preferred utility for date/time logic
