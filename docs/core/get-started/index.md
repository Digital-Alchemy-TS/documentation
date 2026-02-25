---
title: What is Digital Alchemy Core?
sidebar_position: 1
description: "What DA Core is, why it exists, and when to use it."
---

Digital Alchemy Core is a TypeScript application framework built around three ideas: dependency injection through plain functions, explicit lifecycle stages, and type-safe configuration. It runs anywhere Node.js runs — scripts, long-lived daemons, serverless, job queues — without requiring a specific runtime or build tool.

## What it is

The framework gives every service a single parameter, `TServiceParams`, which is built from the dependency graph at boot time. That parameter carries everything the service needs: a scoped logger, lifecycle hooks, config values, references to other services, and a handful of utility primitives. There are no global singletons, no decorator magic, no reflection. You write a plain function, return its public API, and the framework assembles the pieces.

```typescript
import type { TServiceParams } from "@digital-alchemy/core";

export function MyService({ logger, lifecycle, config }: TServiceParams) {
  lifecycle.onReady(() => {
    logger.info({ url: config.my_app.API_URL }, "service ready");
  });

  return {
    greet: (name: string) => `Hello, ${name}`,
  };
}
```

## Key properties

- **No decorators, no reflection.** Services are plain functions. TypeScript does all type inference from return types — no metadata, no `reflect-metadata`, no experimental flags.
- **Explicit lifecycle.** Code runs when you say it runs: `PreInit`, `PostConfig`, `Bootstrap`, `Ready` on the way up; `PreShutdown`, `ShutdownStart`, `ShutdownComplete` on the way down. No implicit initialization order surprises.
- **Type-safe configuration.** Configuration entries are declared as part of the module definition. The framework produces a fully typed `config` object with correct TypeScript types for every entry. Accessing an undeclared key is a type error.
- **Runtime-agnostic.** Node 20+, Bun, tsx, Deno with Node compat — all work.
- **First-class testability.** Every service receives its dependencies through `TServiceParams`. Swapping an implementation for tests is a one-liner.

## What it is not

Digital Alchemy Core is not an HTTP framework. It has no router, no middleware chain, no request/response abstractions. It is the host layer that sits underneath whatever transport you use — Express, Fastify, WebSockets, raw TCP, or no network at all.

## When to use it

If you're writing a TypeScript application that:

- Has multiple services that need to talk to each other
- Needs deterministic startup and shutdown ordering
- Has environment-specific configuration that must be validated at boot
- Will be tested extensively with mocked dependencies

...then DA Core provides structure that scales from a two-service script to a 40-service daemon without changing how individual services are written.

## Jump in

- [Install →](./install.md)
- [Quickstart — build a running app in minutes →](./quickstart.mdx)
