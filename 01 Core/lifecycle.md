## 📚 Description

- #TServiceParams/lifecycle
- #Feature/core/Lifecycle
- #TServiceParams

The application lifecycle helps to coordinate the way various elements of the application load relative to each other. It is divided into distinct phases, and different callbacks may be prioritized relative to each other to ensure all your dependencies have what they need, when they need it.
## 🌐 Phase overview

| Lifecycle Phase                                       | Phase       | Description                                                                                                                                                     | Example Use                                                                         |
| ----------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| construction                                          | `bootstrap` | An informal phase, describes the time when services are building their return output. Code should be limited to general configuration & wiring.                 | Code definitions & function wiring                                                  |
| `onPreInit`<br>#Lifecycle/onPreInit                   | `bootstrap` | Ran prior to gathering user configuration. Frequently used with alternate application flows.                                                                    | 1. check for `--help` flag<br>2. print configuration info<br>3. exit                |
| (configure)                                           | `bootstrap` | When the [[configuration]] does its processing to load user configurations.                                                                                     |                                                                                     |
| `onPostConfig`<br>#Lifecycle/onPostConfig             | `bootstrap` | User configs are populated into the library, libraries & applications can start utilizing that information to further self-configure / initialize dependencies. | Create a reference to an external library (ex: `fastify`)                           |
| `onBootstrap`<br>#Lifecycle/onBootstrap               | `bootstrap` | Configured libraries are available, and can be interacted with.                                                                                                 | Perform wiring actions with that library (ex: add routes)                           |
| `onReady`<br>#Lifecycle/onReady                       | `bootstrap` | Last chance to perform work before the application is officially "running".                                                                                     | Start servers / listen to ports / emit "hello world" messages to connected services |
| (running)                                             | `running`   |                                                                                                                                                                 |                                                                                     |
| `onPreShutdown`<br>#Lifecycle/onPreShutdown           | `teardown`  | Application just received `teardown` call, and intends to start the process                                                                                     | Emit goodbye messages, save caches                                                  |
| `onShutdownStart`<br>#Lifecycle/onShutdownStart       | `teardown`  | The application has received a request to shut down.                                                                                                            | Stop servers, close connections                                                     |
| `onShutdownComplete`<br>#Lifecycle/onShutdownComplete | `teardown`  | Last second to do something before the process exits (or the test completes).                                                                                   | Log a goodbye message that shows the total uptime                                   |

### 🎖 With priorities

> [!example] #Usage-Example/core/lifecycle

Callbacks for lifecycle events have no guaranteed order for when they run relative to each other (within the same event), unless explicitly provided an order.

```typescript
function MyService({ logger, lifecycle }: TServiceParams) {
  lifecycle.onBootstrap(() => {
    logger.info("I happen whenever");
  });
  lifecycle.onBootstrap(() => {
    logger.info("I happen early");
  }, 1);
  lifecycle.onBootstrap(() => {
    logger.info("Higher priority is more first-er");
  }, 2);
}
```
> [!tip] If you attach a callback to a lifecycle event after it already occurred, the callback will be run immediately
> This can be used as an "at least this far in the startup process" guarantee for code

The **"ready"** state may have some asterisks depending on the particular library. Some libraries may provide a separate `onConnect` type event for it's workflows, which may have different implications than a basic `onReady` lifecycle event
