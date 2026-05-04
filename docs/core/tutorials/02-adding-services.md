---
title: Adding Services
sidebar_position: 3
description: "Inter-service communication — how services reference each other through TServiceParams."
---

This tutorial goes deeper on how services talk to each other: through `TServiceParams`, via the module name key, with TypeScript inferring all types automatically.

## The communication model

Services don't import each other. A service in `my_app` never has `import { OtherService } from "./other.service.mts"`. Instead, it receives a reference through `TServiceParams`:

```typescript
export function ConsumerService({ my_app }: TServiceParams) {
  // my_app.producer is the return value of ProducerService
  const result = my_app.producer.doSomething();
}
```

The key `my_app` matches the `name` field in `CreateApplication`. If your app is named `"inventory"`, the key is `inventory`.

## Types flow automatically

When you declare:

```typescript
export const MY_APP = CreateApplication({
  name: "my_app",
  services: { producer: ProducerService },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

TypeScript sees that `my_app` on `TServiceParams` is `typeof MY_APP`. It then infers `my_app.producer` as the return type of `ProducerService`. No explicit type annotations required anywhere in the chain.

## A real example: counter + reporter

```typescript title="src/counter.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

export function CounterService({ }: TServiceParams) {
  let count = 0;

  return {
    increment: () => { count++; },
    decrement: () => { count--; },
    get value() { return count; },
  };
}
```

```typescript title="src/reporter.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

export function ReporterService({ logger, lifecycle, my_app }: TServiceParams) {
  lifecycle.onReady(() => {
    // Increment via the counter service
    my_app.counter.increment();
    my_app.counter.increment();
    my_app.counter.increment();

    // TypeScript knows .value is number — inferred from the getter
    logger.info({ count: my_app.counter.value }, "final count");
  });
}
```

```typescript title="src/application.mts"
import { CreateApplication } from "@digital-alchemy/core";
import { CounterService } from "./counter.service.mts";
import { ReporterService } from "./reporter.service.mts";

export const MY_APP = CreateApplication({
  name: "my_app",
  services: {
    counter: CounterService,
    reporter: ReporterService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

Notice the `get value()` getter in `CounterService`. Getters on the return object expose internal state that can change after wiring — callers see the live value, not a snapshot. This is the idiomatic way to expose readable state that updates over time.

## Accessing services from a library

If your application depends on a library, the pattern is identical. The key is the library's `name` field:

```typescript
export const MY_LIB = CreateLibrary({ name: "my_lib", services: { ... } });

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_lib: typeof MY_LIB;
  }
}
```

```typescript
export function AppService({ my_lib }: TServiceParams) {
  // my_lib is the full typed API of MY_LIB
  my_lib.someService.doThing();
}
```

## What `my_app` is not

`my_app` on `TServiceParams` is not a proxy or a registry — it's just an object. Its shape is assembled during wiring: as each service function returns its value, the framework sets that value on the module's API object. By the time `onBootstrap` fires, every service's return value is in place.

This means `my_app.counter` in an `onReady` callback is always available and always the real return value — not a promise, not a lazy proxy.

:::tip
A service can omit its module key from destructuring if it doesn't need to call other services. That's fine. Only destructure what you need.
:::

Next: [Lifecycle Hooks →](./03-lifecycle-hooks.md)
