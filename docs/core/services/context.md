---
title: Context
id: context
sidebar_position: 1
description: ""
---

Service context is defined as a combination of the module name + service name.

In the following example, `ExampleService` would be assigned a context name of `demo_app:example`.

```typescript
CreateApplication({
  name: "demo_app",
  services: {
    example: ExampleService,
  }
});
```

Context is passed in via `TServiceParams`, and is automatically attached to log messages.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ context, logger }: TServiceParams) {
  logger.info(`hello world`);
}
```

which prints out a message like this

```
[Wed 07:09:15.383] [INFO][demo_app:example]: hello world
```

## Usage

`context` is primarily intended to aid debugging, and downstream libraries such as `synapse` may request it in order to aid debug logging.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ context, synapse }: TServiceParams) {
  synapse.number({
    context,
    name: "example number entity"
  });
}
```

Providing `context` allows the library to emit logs attributed to your service.
