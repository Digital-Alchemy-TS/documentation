---
title: Lifecycle
sidebar_label: Overview
sidebar_position: 1
description: "Lifecycle stages, hooks, and execution order in Digital Alchemy Core."
---

The lifecycle is a sequence of named stages that run after all services are wired. Services register callbacks for stages they care about; the framework executes them in order.

| | |
|---|---|
| [Stages](./stages.md) | The seven stages: what each one means and when it runs |
| [Hooks](./hooks.md) | How to register callbacks; all seven hook methods on `TLifecycleBase` |
| [Execution Order](./execution-order.md) | Priority-based ordering within a stage; sequential vs parallel |

## Quick reference

**Boot stages** (run once, in order):

```
PreInit → PostConfig → Bootstrap → Ready
```

**Shutdown stages** (run once, in order, on SIGTERM/SIGINT or teardown()):

```
PreShutdown → ShutdownStart → ShutdownComplete
```

Within each stage, callbacks are sorted by **priority**: positive values first (highest to lowest, sequential), then unprioritized callbacks (parallel), then negative values (highest to lowest, sequential).
