---
title: Advanced
sidebar_position: 1
description: "Advanced topics for power users: ALS, boot metrics, project tuning, and ServiceRunner."
---

These pages cover topics that go beyond the standard API surface — either because they're rarely needed, require understanding of framework internals, or solve problems specific to production deployments and unusual architectures.

## Pages in this section

| Page | What it covers |
|---|---|
| [Async Local Storage](./async-local-storage.md) | `AlsExtension`, `AsyncLocalData`, automatic log correlation for HTTP servers |
| [Boot Metrics](./boot-metrics.md) | `showExtraBootStats`, reading timing output, CI performance gates |
| [Project Tuning](./project-tuning.md) | `LoggerOptions`, `configSources`, `customLogger`, `handleGlobalErrors` |
| [Service Runner](./service-runner.md) | One-off scripts and automation without a full application module |
| [Platform Entrypoints](./platform-entrypoints.md) | Shared bootstrap for multiple entrypoints, env-specific files, bootstrap wrappers |

## Who these pages are for

Most applications never need any of this. If you're still setting up your app, start with [Get Started](../get-started/index.md) or work through the [Tutorials](../tutorials/index.md) first.

Come back to these pages when you're:
- Investigating slow startup times
- Deploying to production and tuning log output for an aggregator
- Writing a CLI tool or migration script
- Building an HTTP server that needs per-request log correlation
- Setting up multiple entrypoints (serverless functions, worker + API) that share one bootstrap
- Building a bootstrap wrapper for a multi-service platform
