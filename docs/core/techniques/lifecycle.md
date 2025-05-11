---
title: 👶 Lifecycle
---

The `lifecycle` is available on `TServiceParams`, and helps to coordinate the way various elements of the application load relative to each other. It is divided into distinct phases, and different callbacks may be prioritized relative to each other to ensure all your dependencies have what they need, when they need it.

## 🌐 Phase overview

| Lifecycle Phase        | Phase       | Description                                                                                                                                                     | Example Use                                                                         |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `construct`          | `bootstrap` | An informal phase, describes the time when services are building their return output. Code should be limited to general configuration & wiring.                 | Code definitions & function wiring                                                  |
| `onPreInit`          | `bootstrap` | Ran prior to gathering user configuration. Frequently used with alternate application flows.                                                                    | 1. check for `--help` flag, print configuration info, exit                |
| (configure)            | `bootstrap` | When the [Configuration](/docs/core/techniques/configuration) does its processing to load user configurations.                                                                                     |                                                                                     |
| `onPostConfig`       | `bootstrap` | User configs are populated into the library, libraries & applications can start utilizing that information to further self-configure / initialize dependencies. | Create a reference to an external library (ex: `fastify`)                           |
| `onBootstrap`        | `bootstrap` | Configured libraries are available, and can be interacted with.                                                                                                 | Perform wiring actions with that library (ex: add routes)                           |
| `onReady`            | `bootstrap` | Last chance to perform work before the application is officially "running".                                                                                     | Start servers / listen to ports / emit "hello world" messages to connected services |
| (running)              | `running`   |                                                                                                                                                                 |                                                                                     |
| `onPreShutdown`      | `teardown`  | Application just received `teardown` call, and intends to start the process                                                                                     | Emit goodbye messages, save caches                                                  |
| `onShutdownStart`    | `teardown`  | The application has received a request to shut down.                                                                                                            | Stop servers, close connections                                                     |
| `onShutdownComplete` | `teardown`  | Last second to do something before the process exits (or the test completes).                                                                                   | Log a goodbye message that shows the total uptime                                   |

### 🎖 With priorities

> Callbacks for lifecycle events have no guaranteed order for when they run relative to each other (within the same event), unless explicitly provided an order.

If you attach a callback to a lifecycle event after it already occurred, the callback will be run immediately. This can be used as an "at least this far in the startup process" guarantee for code

```typescript
function MyService({ logger, lifecycle }: TServiceParams) {
  // sorted into execution order

  lifecycle.onBootstrap(() => {
    logger.info("I happen first");
  }, 2);

  lifecycle.onBootstrap(() => {
    logger.info("I happen early");
  }, 1);

  lifecycle.onBootstrap(() => {
    logger.info("I exist too");
  }, 0);

  // in between 0 & negative numbers
  lifecycle.onBootstrap(() => {
    logger.info("I happen after the priority callbacks");
  });

  lifecycle.onBootstrap(() => {
    logger.info("I happen late");
  }, -1);

  lifecycle.onBootstrap(() => {
    logger.info("I happen really late");
  }, -2);
}
```

## 🏎️ Boot Libraries First

> `bootLibrariesFirst` is a flag that can be passed to the bootstrap command of your application.

By passing this flag, the construction phase will be moved:

- **from:** just after all the libraries are built
- **to:** just after `onBootstrap` has completed

### Applications

By setting this flag, you get to ignore a lot of the library bootstrap process.

- everything is configured from the start
- home assistant services can be called any time
- entities already have state

> 💡 For **home automation** applications, it is recommended to set this
>
> ```typescript
> myApplication.bootstrap({ bootLibrariesFirst: true });
> ```

### Libraries

Working with the lifecycle events to ensure your resources are available at the correct time is essential.
Internally wrapping a `lifecycle` call can be an easy way to provide a clean api while accounting for the lifecycle complexities.

```typescript
function SpecialBuilder({ logger, lifecycle }: TServiceParams) {

  return function(data: ExampleOptions) {
    lifecycle.onReady(async () => {
      // waits for ready before running
      // run immediately if ready already complete
    })
  }
}
