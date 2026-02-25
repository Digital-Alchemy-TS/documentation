---
title: Core Concepts
sidebar_label: Overview
sidebar_position: 1
description: "The foundational concepts behind Digital Alchemy Core."
---

These pages explain how Digital Alchemy works under the hood. You don't need to read them before you can build things, but understanding them will make you significantly more effective — especially when something goes wrong at boot.

| | |
|---|---|
| [Bootstrapping](./bootstrapping.md) | The full boot sequence from `bootstrap()` to `onReady`, with a diagram |
| [Dependency Injection](./dependency-injection.md) | How `TServiceParams` is built and why types flow automatically |

## The mental model in one paragraph

When you call `MY_APP.bootstrap()`, Digital Alchemy walks the module graph in dependency order, calling each service function once to build its return value. Each function receives a `TServiceParams` object whose shape is assembled from the modules already wired. Services register callbacks for lifecycle stages instead of running code immediately. Once all services are wired, the lifecycle stages run in sequence. Your application is "ready" only after all of that completes.

Everything else in the framework — config, logging, testing, the scheduler — is built on top of this foundation.
