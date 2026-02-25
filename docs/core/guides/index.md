---
title: Guides
sidebar_position: 1
description: "Deep dives into how Digital Alchemy Core works."
---

Guides are narrative explanations with diagrams. Where the reference answers "what does this do?", guides answer "why does it work this way?" and "what's actually happening inside?".

| Guide | What it covers |
|---|---|
| [Bootstrap Internals](./bootstrap-internals.md) | The exact boot sequence — wiring phases, lifecycle stages, shutdown |
| [Dependency Injection](./dependency-injection.md) | Why DI, how DA's model works, what LoadedModules actually does |
| [Application Structure](./application-structure.md) | Organizing a real multi-service, multi-library application |
| [Config and Environments](./config-and-environment.md) | Config flow from definition to validated values; multi-environment patterns |
| [Testing Strategies](./testing-strategies.md) | Philosophy, unit vs integration, mocking approaches |
| [Log Streaming](./log-streaming.md) | `addTarget`, fire-and-forget delivery, `mergeData`, and ALS tagging |
| [Config in Production](./config-in-production.md) | Per-type patterns, manifest files, adapter toggles |
