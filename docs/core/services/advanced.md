---
title: Advanced
id: services_advanced
sidebar_position: 5
description: ""
---

## Service Returns In-Depth

The Digital Alchemy framework has support for 3 different return types from services.

```typescript
CreateLibrary({
  configuration: {
    ADAPTER_URL: { type: "string", required: true },
  },
  name: "example_library",
  services: {
    none: NoneService,
    function: FunctionService,
    object: ObjectService,
    custom: CustomReturnService,
    adapter: AdapterService,
  },
});
```

### None

```typescript
export function NoneService({
  lifecycle,
  logger,
  example_library,
}: TServiceParams) {
  lifecycle.onReady(() => {
    logger.info("doing stuff onReady");
  });

  example_library.none;
  //              ^^^^ not a useful thing
}
```

Service functions are not forced into returning anything if the particular situation has nothing to return.

### Function Services

```typescript
export function FunctionService({
  example_library,
  logger,
  lifecycle,
}: TServiceParams) {
  lifecycle.onReady(() => {
    // service return can be invoked directly
    example_library.function();
  });

  return function () {
    logger.info("I was run");
  };
}
```

### Object Services

```typescript
export function ObjectService({ example_library, logger }: TServiceParams) {
  function methodA() {
    logger.info("methodA method run");
    // runnable via the publicly accessible path
    example_library.object.methodB();
  }

  function methodB() {
    logger.info("methodB method run");
    // run any method in scope
    privateMethod();
  }

  // don't need to export if you don't want to
  function privateMethod() {
    logger.info("private method run");
  }

  return {
    methodA,
    methodB,
    inlineReturn: () => logger.info("this works too"),
  };
}
```

Utilizing object returns can be an effective way of exposing more functionality than a single function can provide.

## Service Definitions

The type that your service publicly provides depends on the return type of your service.
This is usually able to to be inferred by Typescript, but you are also able to manually define your own to be explicit.

```typescript
interface CustomReturnServiceReturn {
  /**
   * tsdoc wll be included in editors
   */
  name: string
}

// explicit return defintions
export function CustomReturnService(): () => CustomReturnServiceReturn {
  return async function () {
    return {
      ...
    }
  };
}
```

## Delayed Initialization

Sometimes libraries have internal workflows that require that public properties be created at a time later than initial construction.
Configuration dependant adapters are one example

### Manipulate public properties

Services are only invoked once during application creation, with the resulting return being common to all other services.

This allows for direct manipulation of properties provided via params. <sup>(do this with care)</sup>

```typescript
import { create, InstanceType } from "some-library";

// Explicit return for service, ensuring instance has the correct type everywhere
interface AdapterServiceReturn {
  /**
   * tsdoc wll be included in editors
   */
  instance: InstanceType;
}

export function AdapterService({
  example_library,
  config,
  lifecycle,
}: TServiceParams): AdapterServiceReturn {
  // wait for all config sources to finish loading
  lifecycle.onPostConfig(() => {
    // replace the previously provided undefined value
    example_library.adapter.instance = create(
      config.example_library.ADAPTER_URL
    );
  });

  return {
    // has a type because of the explicit return on the service
    instance: undefined,
  };
}
```

### Getters

Using a function to return an internal can be a simple way to quickly expose an otherwise internal variable that may mutate and difficult to reference.

```typescript
export function GetterService({
  config,
  scheduler,
}: TServiceParams): AdapterServiceReturn {
  let lastValue: number;

  scheduler.setInterval(() => (lastValue = Math.random()), { second: 5 });

  return {
    getLastValue: () => lastValue,
  };
}
```
