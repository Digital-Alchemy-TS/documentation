---
title: TServiceParams
sidebar_position: 5
description: "Complete reference for the TServiceParams object received by every service."
---

Every service function receives a single `TServiceParams` argument. This object is assembled by the framework from whatever has been wired at the time the service is called. Its shape is fully typed and varies based on which modules are loaded.

## Built-in properties

These are always available regardless of which libraries are loaded:

### `context`

A string in the format `module_name:service_key`. Automatically attached to log messages. Pass it to downstream libraries (like `synapse`) so they can attribute their logs to your service.

```typescript
export function MyService({ context }: TServiceParams) {
  // context === "my_app:my_service"
}
```

### `logger`

A context-aware `ILogger` instance. All methods (`debug`, `info`, `warn`, `error`, `fatal`, `trace`) automatically include the service context in output.

```typescript
logger.info("started");
// [INFO][my_app:my_service]: started

logger.info({ count: 42 }, "found %s items", 42);
// structured + formatted
```

See [Logger](../06-builtins/logger.md) for full API.

### `lifecycle`

Register callbacks for any lifecycle stage. See [Lifecycle Hooks](../04-lifecycle/hooks.md).

```typescript
lifecycle.onReady(() => { /* runs when fully booted */ });
lifecycle.onPreShutdown(() => { /* cleanup before shutdown */ });
```

### `scheduler`

Schedule recurring work. Takes a `context` parameter for logging. See [Scheduler](../06-builtins/scheduler.md).

```typescript
const job = scheduler(context).cron({
  schedule: CronExpression.EVERY_MINUTE,
  exec: async () => { /* ... */ },
});
```

### `config`

Typed access to all configuration values, keyed by module name:

```typescript
const url = config.my_lib.API_BASE_URL;   // string
const ttl = config.my_lib.CACHE_TTL;      // number
const lvl = config.boilerplate.LOG_LEVEL; // "silent" | "trace" | ...
```

Values are available after `PostConfig`. Reading config at the top level of your service function (before `onPostConfig`) returns the default, not the sourced value.

### `event`

Application-wide Node.js `EventEmitter`. Shared across all services. Recreated at bootstrap and cleaned up at teardown.

```typescript
event.emit("my_app:thing_happened", { id: "123" });
event.on("my_app:thing_happened", handler);
```

See [Event Emitter](../06-builtins/event-emitter.md).

### `als`

AsyncLocalStorage wrapper. Used for request-scoped data and log correlation. See [Async Local Storage](../08-advanced/async-local-storage.md).

### `internal`

Framework internals. Mostly for framework authors and advanced use cases, but a few utilities are useful in application code:

```typescript
internal.utils.is          // Type guards (is.string, is.array, is.empty, ...)
internal.utils.relativeDate(date) // Human-readable relative time
internal.utils.object.get(obj, "nested.path")  // Deep get
internal.utils.object.set(obj, "nested.path", val)
internal.safeExec(fn)      // Call fn, log any error instead of throwing
internal.removeFn(fn)      // Make a fn callable as both fn() and fn.remove()
```

## Module service properties

Any module with a `LoadedModules` declaration contributes its services to `TServiceParams`. The key is the module's `name`:

```typescript
// MY_LIB has name: "my_lib" with services: { api, cache }
export function ConsumerService({ my_lib }: TServiceParams) {
  my_lib.api.get(...)   // typed as the return value of ApiService
  my_lib.cache.set(...) // typed as the return value of CacheService
}
```

TypeScript enforces this entirely at compile time — if `MY_LIB` is not in your application's `libraries` array and doesn't have a `LoadedModules` declaration, accessing `my_lib` will be a type error.
