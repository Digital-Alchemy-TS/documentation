---
title: Builtins
sidebar_position: 1
description: "Built-in services always available on TServiceParams, and standalone utility exports."
---

Digital Alchemy Core provides several built-in services that are wired automatically before any library or application services run. They're always available on `TServiceParams` — no `depends` declaration needed.

## Built-in services (on TServiceParams)

| Service | Type | Description |
|---|---|---|
| `logger` | `GetLogger` | Context-scoped logger |
| `lifecycle` | `TLifecycleBase` | Lifecycle hook registration |
| `config` | `TInjectedConfig` | Typed configuration object |
| `scheduler` | `TScheduler` | Cron, interval, and timeout scheduling |
| `event` | `EventEmitter` | App-wide event bus |
| `als` | `AlsExtension` | Async Local Storage |
| `internal` | `InternalDefinition` | Utilities and boot metadata |

These are part of the `boilerplate` module, which always wires first. They live at `config.boilerplate.*` for configuration and are wired in this order: `als` → `configuration` → `logger` → `scheduler`.

## Standalone exports

These utilities are exported directly from `@digital-alchemy/core` and imported at the module level — they don't appear on `TServiceParams`.

| Export | Description |
|---|---|
| `is` | Type guard singleton |
| `sleep` | Async sleep with cancel support |
| `debounce` | Identifier-keyed debounce |
| `each` | Parallel `Promise.all` over array/Set |
| `eachSeries` | Sequential iteration |
| `eachLimit` | Bounded-concurrency iteration |
| `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK` | Millisecond constants |

```typescript
import { is, sleep, each, SECOND } from "@digital-alchemy/core";
```

See [Utilities](./utilities.md) for detailed documentation on each.

## See also

- [Logger](./logger.md)
- [Scheduler](./scheduler.md)
- [Event Bus](./event.md)
- [Utilities](./utilities.md)
