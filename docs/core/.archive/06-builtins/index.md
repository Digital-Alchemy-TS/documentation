---
title: Built-in Services
sidebar_label: Overview
sidebar_position: 1
description: "The built-in services available on TServiceParams in every Digital Alchemy app."
---

These services are wired by the boilerplate before any user code runs, making them available on `TServiceParams` in every service function.

| | |
|---|---|
| [Logger](./logger.md) | Context-aware structured logging with levels and stream targets |
| [Scheduler](./scheduler.md) | Cron, interval, sliding window, and one-shot timers |
| [Event Emitter](./event-emitter.md) | Application-wide `EventEmitter` for cross-service pub/sub |
| [Utilities](./utilities.md) | `is` type guards, `sleep`, `debounce`, time constants |
