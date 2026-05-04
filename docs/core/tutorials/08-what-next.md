---
title: What Next?
sidebar_position: 9
description: "You've learned the core model — here's where to go from here."
---

You now understand the essential building blocks of Digital Alchemy Core:

- Services are plain functions that receive `TServiceParams` and return their public API
- Modules wire services together; `LoadedModules` connects the type system
- Lifecycle hooks control when code runs — `PostConfig`, `Bootstrap`, `Ready`
- Configuration is declared per-module and validated at boot
- Libraries package services for reuse across applications
- `TestRunner` boots your real application in an isolated test environment

## Reference — when you need the details

| Topic | Reference page |
|---|---|
| All `CreateApplication` options | [CreateApplication](../reference/application/create-application.md) |
| All `BootstrapOptions` fields | [Bootstrap Options](../reference/application/bootstrap.md) |
| `TServiceParams` full property list | [TServiceParams](../reference/services/service-params.mdx) |
| All 7 lifecycle hooks | [Hooks](../reference/lifecycle/hooks.md) |
| Lifecycle execution order and priorities | [Execution Order](../reference/lifecycle/execution-order.md) |
| Config types, sourcing, and access | [Config Overview](../reference/config/overview.md) |
| Logger, scheduler, event bus | [Builtins](../reference/builtins/index.md) |
| `TestRunner` full API | [TestRunner](../reference/testing/test-runner.md) |

## Guides — mental models

| Question | Guide |
|---|---|
| What exactly happens when I call `bootstrap()`? | [Bootstrap Internals](../guides/bootstrap-internals.md) |
| Why DI? Why not just import everything? | [Dependency Injection](../guides/dependency-injection.md) |
| How do I organize a real multi-service app? | [Application Structure](../guides/application-structure.md) |
| How does config flow from env to my code? | [Config and Environments](../guides/config-and-environment.md) |
| How should I approach testing? | [Testing Strategies](../guides/testing-strategies.md) |

## Advanced

| Topic | Page |
|---|---|
| Async Local Storage and structured logging | [Async Local Storage](../advanced/async-local-storage.md) |
| Boot timing and performance metrics | [Boot Metrics](../advanced/boot-metrics.md) |
| Logger options, config sources, custom logger | [Project Tuning](../advanced/project-tuning.md) |
