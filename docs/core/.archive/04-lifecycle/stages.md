---
title: Stages
sidebar_position: 2
description: "The seven lifecycle stages in Digital Alchemy Core and what they mean."
---

The lifecycle stages are defined in `LIFECYCLE_STAGES` (from `@digital-alchemy/core`). They run in a fixed order — you cannot change the sequence, only the priority of callbacks *within* a stage.

## Boot stages

### PreInit

The first stage. Runs before config is applied. Use for initialization that must happen before any configuration values are processed — for example, setting up log transports or registering external systems that the config system will query.

Config values read here may not yet reflect sourced values (only defaults).

### PostConfig

Configuration is now validated and fully sourced. Required config entries are checked here — if any are missing, bootstrap throws `REQUIRED_CONFIGURATION_MISSING` and halts.

This is the first stage where it's safe to read `config.*` values and make decisions based on them.

```typescript
lifecycle.onPostConfig(() => {
  if (!config.my_app.DATABASE_URL) {
    // won't reach here — required config is already checked before PostConfig callbacks
  }
  logger.info({ url: config.my_app.DATABASE_URL }, "config loaded");
});
```

### Bootstrap

Main initialization. All services are wired, config is validated, and all lifecycle tools are available. This is the right place for:

- Establishing external connections (database, HTTP clients)
- Loading initial data
- Starting internal state machines

### Ready

The application is fully started. Use this for:

- Opening listening sockets / starting HTTP servers
- Beginning job processing
- Emitting an event to signal that the app is available

Everything registered with `onReady` runs after `onBootstrap` has completed for all services.

## Shutdown stages

Shutdown is triggered automatically on `SIGTERM` or `SIGINT`, or manually via `app.teardown()`.

### PreShutdown

First signal that shutdown is coming. Use for stopping incoming work (pausing queues, closing ingress, signaling readiness probes). The app is still fully functional at this point.

### ShutdownStart

Begin active shutdown. Close connections, flush buffers, cancel scheduled jobs. The scheduler automatically cancels all active cron/interval jobs here.

### ShutdownComplete

Final cleanup. The lifecycle manager removes its event listeners after this stage. Any logging here is best-effort — output channels may already be closing.

## The `LIFECYCLE_STAGES` constant

If you need to iterate over stages programmatically:

```typescript
import { LIFECYCLE_STAGES } from "@digital-alchemy/core";
// ["PreInit", "PostConfig", "Bootstrap", "Ready", "PreShutdown", "ShutdownStart", "ShutdownComplete"]
```
