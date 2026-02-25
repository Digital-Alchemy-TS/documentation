---
title: Function Return
sidebar_position: 4
description: "Returning a function from a service: factories and single-callable services."
---

Returning a function from a service makes the service itself callable. Other services invoke it as `my_app.service(arg)` rather than `my_app.service.method(arg)`.

## When to use

Use a function return when the service's primary interface is a single callable — typically a factory, builder, or context-scoped utility. If you find yourself returning an object with only one meaningful method, a function return is usually cleaner.

## Basic example

```typescript
export function LoggerFactoryService({ }: TServiceParams) {
  return (namespace: string) => ({
    info:  (msg: string) => console.log(`[${namespace}] INFO  ${msg}`),
    error: (msg: string) => console.error(`[${namespace}] ERROR ${msg}`),
  });
}
```

Other services use it as:

```typescript
export function PaymentsService({ my_app }: TServiceParams) {
  const log = my_app.loggerFactory("payments");
  log.info("processing payment");
}
```

## Factory pattern

Function returns are natural for factories that produce configured instances:

```typescript
export function HttpClientService({ config, lifecycle }: TServiceParams) {
  const baseUrl = config.my_lib.BASE_URL;

  return (path: string) => ({
    get: async () => fetch(`${baseUrl}${path}`).then(r => r.json()),
    post: async (body: unknown) => fetch(`${baseUrl}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then(r => r.json()),
  });
}

// Usage: my_lib.http("/users").get()
```

## Returning a class-like callable

You can return an arrow function that also carries properties, though this is less common:

```typescript
export function BuilderService({ }: TServiceParams) {
  const build = (name: string) => new Widget(name);
  build.count = () => Widget.count;
  return build;
}

// my_app.builder("foo")
// my_app.builder.count()
```

TypeScript infers the full type of whatever the function returns.

## Void-returning callable

A service can return a function that returns `void` — useful for callbacks:

```typescript
export function NotifierService({ event }: TServiceParams) {
  return (message: string) => {
    event.emit("notification", message);
  };
}

// my_app.notify("hello!")
```
