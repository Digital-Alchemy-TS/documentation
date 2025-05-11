---
title: Services
---

Service functions are the basic building block of logic for logic within applications.
They operate by a few rules that allow you to string together logic with minimal imports and maximum flexibility

## Format

Service functions only take in a single parameter of type `TServiceParams`.
This variable contains a few basic tools from the `core` framework, and all of the tools available within the application.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function HealthCheckService({ logger }: TServiceParams) {
  function checkHealth() {
    return { healthy: true };
  }

  return {
    checkHealth,
  };
}
```

The return value of the service is used to build options inside of `TServiceParams`, allowing access between services & modules.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function HealthCheckController({ my_app, http }: TServiceParams) {
  http.get("/health", () => my_app.health.checkHealth());
}
```

### Service Returns

The return type of services can come in a few types

1. None
2. Function return - `my_app.function_service()`

```typescript
function FunctionReturnExample({ }: TServiceParams) {
  return function () {
    // do logic
  }
}
```

3. Object return `my_app.object_return.doStuff()`

```typescript
function ObjectReturnExample({ }: TServiceParams) {
  function doStuff () {
    // do logic
  }

  return {
    doStuff,
  }
}
```

### Public vs private logic

Service functions support a concept similar to `public` & `private` methods on classes, utilizing variable scoping.

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { Thing } from "./types.mts";

export function SpecialRestClient({ api_wrapper, metrics }: TServiceParams) {
  const connection: SpecialConnection;

  async function send<T>(path: string, args: payload): Promise<T> {
    return await metrics.time_histogram<T>(
      "api_wrapper.api_call",
      [`path:${path}`],
      async (): Promise<T> => {
        // complicated sending logic
        return ...
      }
    );
  }

  async function list(): Promise<Thing[]> {
    return await api_wrapper.fetch.send("/list");
  }

  async function byId(id: string): Promise<Thing> {
    return await send(`/by-id/${id}`);
  }

  async function add(data: Thing): Promise<Thing> {
    return await api_wrapper.fetch.send("/add", { data });
  }

  return { send, list, byId, add };
}
```

In the above example, `byId` utilizes a direct reference to `send` while the other methods use the version provided via the service's own export.
This works because the module values provided for `TServiceParams` contain all the values across the including itself, as long as order of operations for construction is respected.

There differences between the two formats includes some nuance.
While the direct call is valid the other format can be more easily tested

### Example test

> Partial example, see [testing](/docs/testing) for more.

This example test of the service logic is aiming to show it does a correct url transformation.

```typescript
it("calls correct endpoint for by-id", async () => {
  await testRunner.run(async ({ api_wrapper }) => {
    // replace send call so it doesn't actually try to send something
    const send = vi
      .spyOn(api_wrapper.fetch, "send")
      .mockImplementation(async () => undefined);

    // run logic
    await api_wrapper.fetch.byId("12345");

    // test result
    expect(send).toHaveBeenCalledWith("/by-id/12345");
  });
});
```

> ⚠️ This test will fail because the service function above was written with a direct call to `send` instead of the new spy
