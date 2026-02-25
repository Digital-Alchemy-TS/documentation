---
title: Reference
sidebar_position: 1
description: "Complete API reference for Digital Alchemy Core."
---

The reference section is a complete lookup guide for every API in `@digital-alchemy/core`. Pages are organized by concern.

## Application

| Page | Description |
|---|---|
| [CreateApplication](./application/create-application.md) | All `CreateApplication` options and the `ApplicationDefinition` API |
| [Bootstrap Options](./application/bootstrap.md) | All `BootstrapOptions` fields, process exit codes, signal handling |

## Libraries

| Page | Description |
|---|---|
| [CreateLibrary](./libraries/create-library.md) | `CreateLibrary` options, `depends` vs `optionalDepends` |
| [Dependency Graph](./libraries/dependency-graph.md) | `buildSortOrder`, `BAD_SORT`, `MISSING_DEPENDENCY` |
| [Module Extension](./libraries/module-extension.md) | `createModule` and `ModuleExtension` chainable API |

## Services

| Page | Description |
|---|---|
| [Service Functions](./services/service-function.md) | `ServiceFunction` signature, wiring semantics |
| [TServiceParams](./services/service-params.mdx) | All `TServiceParams` properties, `internal` utilities |
| [Object Return](./services/returns-object.md) | Methods, getters, live state |
| [Function Return](./services/returns-function.md) | Factory and callable patterns |
| [priorityInit](./services/priority-init.md) | Wiring order within a module |

## Lifecycle

| Page | Description |
|---|---|
| [Overview](./lifecycle/overview.md) | `LIFECYCLE_STAGES`, stage reference, full sequence diagram |
| [Hooks](./lifecycle/hooks.md) | All 7 hook methods |
| [Execution Order](./lifecycle/execution-order.md) | Priority tiers, parallel vs serial, late registration |

## Configuration

| Page | Description |
|---|---|
| [Overview](./config/overview.md) | `LOAD_PROJECT`, `TInjectedConfig`, module scoping |
| [Types](./config/types.mdx) | All 6 config types with TypeScript mappings |
| [Sourcing](./config/sourcing.md) | Env, argv, file loaders; merge order; custom loaders |
| [Accessing Config](./config/access.md) | Timing, required entries, source restriction |

## Builtins

| Page | Description |
|---|---|
| [Overview](./builtins/index.md) | What builtins are; standalone exports |
| [Logger](./builtins/logger.md) | `GetLogger`, levels, targets, overrides |
| [Scheduler](./builtins/scheduler.md) | `TScheduler` — all 5 methods |
| [Event Bus](./builtins/event.md) | `EventEmitter`, typed events, error constants |
| [Utilities](./builtins/utilities.md) | `sleep`, `debounce`, `is`, `each`, timing constants |

## Testing

| Page | Description |
|---|---|
| [TestRunner](./testing/test-runner.md) | Constructor, all fluent builder methods |
| [Module Replacements](./testing/module-replacements.md) | `appendLibrary`, `appendService`, `replaceLibrary` |
| [Test Lifecycle](./testing/test-lifecycle.md) | Lifecycle stages in tests, setup, teardown |
| [Configuration Overrides](./testing/configuration-overrides.md) | `.configure()`, `PartialConfiguration`, isolation |
