---
title: Next Steps
sidebar_position: 4
description: "Where to go after the Digital Alchemy Core quickstart."
---

Once you have the quickstart running, here's a recommended reading order depending on what you want to do next.

## Understand the fundamentals

These two pages explain *why* Digital Alchemy works the way it does. Read them before diving into the API reference — they'll make everything else click faster.

- **[Bootstrapping](../02-core-concepts/bootstrapping.md)** — what happens between `bootstrap()` and your first `onReady` callback; the full wiring sequence with a diagram
- **[Dependency Injection](../02-core-concepts/dependency-injection.md)** — why plain function injection instead of decorators or globals; how `TServiceParams` gets its types

## Build something real

- **[Services](../03-module-system/services.md)** — service function pattern, return shapes, and how services access each other
- **[Applications & Libraries](../03-module-system/applications.md)** — structuring larger projects with reusable library modules
- **[Configuration](../05-configuration/index.md)** — define typed config, source from env/files/CLI, validate at boot

## Go deeper

- **[Lifecycle](../04-lifecycle/index.md)** — all seven stages, hook registration, priority execution
- **[Built-in Services](../06-builtins/index.md)** — logger, scheduler (cron, interval, sliding), event emitter, utilities
- **[Testing](../07-testing/index.md)** — `TestRunner`, module manipulation, fake timers, lifecycle testing
