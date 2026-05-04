---
title: Platform Entrypoints
sidebar_position: 5
description: "Multiple entrypoints sharing one bootstrap, environment-specific entrypoint files, and bootstrap wrappers for platform defaults."
---

Real deployments rarely have a single entrypoint that runs forever. This page covers three patterns that address how production applications boot: sharing a single bootstrap across multiple process entrypoints, using separate files per deployment context, and centralizing deployment defaults in a wrapper function.

## Part 1 — Multiple entrypoints

Some deployments need multiple process entrypoints that share the same services, configuration, and libraries. Examples: three serverless functions sharing a backend; a web server and a background worker; a cron job and an HTTP API.

The naive approach — bootstrapping separately in each entrypoint — wastes resources and risks configuration drift. The correct approach bootstraps once and exports the result.

### The breakout pattern

Create a `bootstrap.mts` that bootstraps your application and exports the services each entrypoint needs:

```typescript title="src/bootstrap.mts"
import { MY_APP } from "./app.module.mts";

export const { my_app, http, config } = await MY_APP.bootstrap({
  configSources: { argv: false, file: false },
});
```

Each entrypoint imports only what it needs:

```typescript title="src/entrypoints/worker.mts"
import { my_app } from "../bootstrap.mts";

export async function handleJob(event: JobEvent) {
  return my_app.jobs.process(event);
}
```

```typescript title="src/entrypoints/health.mts"
import { http } from "../bootstrap.mts";

export const handler = http.createHandler();
```

### Why this works

Top-level `await` at module level means `bootstrap.mts` runs exactly once per process. When `worker.mts` and `health.mts` both import from `bootstrap.mts`, Node/Bun resolves the module from cache — the bootstrap call doesn't run again. Each entrypoint file gets the same already-initialized services.

Each **process** (each Lambda invocation context, each worker process) has its own module graph. Bootstrap runs once per process, not once globally.

### What each entrypoint imports

Entrypoints destructure only the services they need from the bootstrap export — not the full `TServiceParams`. This keeps entrypoint files small and makes the dependency boundary explicit:

```typescript
// Good: import only what the entrypoint uses
import { http, my_app } from "../bootstrap.mts";

// Not needed: the full bootstrap options or internal services
```

This pattern works for any multi-function deployment: serverless functions, job runners, CLI commands, cron workers, multi-protocol servers (HTTP + gRPC).

---

## Part 2 — Environment-specific entrypoints

Instead of a single `main.mts` that detects the environment at runtime and branches on `process.env.NODE_ENV`, use separate entrypoint files. Each is a plain bootstrap call hardcoded for its context.

```typescript title="src/environments/local.mts"
import { MY_APP } from "../app.module.mts";

await MY_APP.bootstrap({
  configSources: { argv: false, env: true, file: false },
  loggerOptions: {
    als: true,
  },
  showExtraBootStats: true,
  configuration: {
    boilerplate: { LOG_LEVEL: "debug" },
    my_app: { PORT: 3000 },
  },
});
```

```typescript title="src/environments/prod.mts"
import { hostname } from "node:os";
import { MY_APP } from "../app.module.mts";

await MY_APP.bootstrap({
  configSources: { argv: false, env: true, file: false },
  loggerOptions: {
    als: true,
    counter: false,
    pretty: false,
    mergeData: {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),
      service: "my-api",
    },
  },
  showExtraBootStats: true,
});
```

The prod entrypoint sets `pretty: false` for JSON output, `mergeData` to tag every log line with deployment context, and `als: true` for per-request log correlation. Values like `DATABASE_URL` come from environment variables — not from `configuration` in the entrypoint.

### The validate entrypoint

A dedicated entrypoint for configuration validation is useful in CI/CD pipelines. It boots the application, confirms all required config entries can be resolved, then exits cleanly — without starting any servers or background workers.

```typescript title="src/environments/validate.mts"
import { MY_APP } from "../app.module.mts";

await MY_APP.bootstrap({
  configuration: {
    boilerplate: { LOG_LEVEL: "fatal" },  // suppress all output
    my_app: { VALIDATE_CONFIG: true },
  },
  loggerOptions: { als: true },
});
```

The application itself handles the exit:

```typescript title="src/services/lifecycle.service.mts"
export function LifecycleService({ config, lifecycle, logger }: TServiceParams) {
  lifecycle.onPostConfig(() => {
    if (config.my_app.VALIDATE_CONFIG) {
      logger.info("configuration is valid");
      process.exit(0);
    }
  });
}
```

`onPostConfig` is the right lifecycle stage for this: all config has been loaded and validated, but the HTTP server and background workers haven't started yet. The process exits cleanly after confirming the full config pipeline ran.

```typescript
// In config definition:
VALIDATE_CONFIG: {
  type: "boolean",
  default: false,
},
```

Run it in CI:

```bash
MY_APP__VALIDATE_CONFIG=true node dist/environments/validate.js
```

Or use the dedicated validate entrypoint where `VALIDATE_CONFIG: true` is hardcoded — no environment variable needed.

### Why separate files beat runtime branching

Runtime branching (`if (process.env.NODE_ENV === "production") { ... }`) means every environment's boot path is in every deployment artifact. It accumulates conditional logic as the application grows, and it's easy to accidentally enable a dev-only option in prod or vice versa.

Separate entrypoint files are static: each file contains exactly the options for that context, no conditionals. The prod file has never had `LOG_LEVEL: "debug"` in it. The local file has never accidentally set `pretty: false`. The deployment toolchain points to the right file for each context.

---

## Part 3 — Bootstrap wrappers

When many applications share the same deployment platform — a monorepo deploying dozens of services to the same infrastructure — duplicating the prod entrypoint for each app creates drift. A wrapper function centralizes the platform defaults:

```typescript title="src/platform/bootstrap.mts"
import { hostname } from "node:os";
import { existsSync } from "node:fs";
import type { ApplicationDefinition, BootstrapOptions } from "@digital-alchemy/core";

const MANIFEST_FILE = ".manifest.yaml";

export async function bootstrapForPlatform<S, C>(
  app: ApplicationDefinition<S, C>,
  options: BootstrapOptions = {},
) {
  const isDeployed = process.env.NODE_ENV === "production";

  // Apply platform defaults without overriding what the caller already set
  options.configSources ??= {};
  options.configSources.argv ??= false;
  options.configSources.file ??= !isDeployed;

  options.loggerOptions ??= {};
  options.loggerOptions.als ??= true;
  options.loggerOptions.pretty ??= !isDeployed;
  options.loggerOptions.stdOut ??= true;

  if (isDeployed) {
    options.loggerOptions.mergeData ??= {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),
    };
  }

  options.configuration ??= {};
  options.configuration.boilerplate ??= {};
  options.configuration.boilerplate.LOG_LEVEL ??= isDeployed ? "info" : "debug";

  // Auto-detect infrastructure-managed manifest
  if (existsSync(MANIFEST_FILE)) {
    options.configuration.boilerplate.CONFIG = MANIFEST_FILE;
  }

  return app.bootstrap(options);
}
```

Applications use the wrapper in place of calling `bootstrap()` directly:

```typescript title="src/apps/my-service/main.mts"
import { MY_SERVICE } from "./app.module.mts";
import { bootstrapForPlatform } from "../../platform/bootstrap.mts";

await bootstrapForPlatform(MY_SERVICE, {
  // Override only what's specific to this app
  configuration: {
    my_service: { PORT: 3001 },
  },
});
```

### The `??=` pattern

`??=` (nullish assignment) applies a default only if the value is `null` or `undefined`. This is the correct operator for wrapper defaults: it applies the platform's opinion without stomping on overrides the caller already provided.

```typescript
options.loggerOptions.pretty ??= !isDeployed;
// If the caller passed `loggerOptions: { pretty: true }`, that value is kept.
// If the caller passed nothing, the platform default is applied.
```

Using `=` instead would override caller values. Using `||=` would override falsy values (like `pretty: false` in a test scenario). `??=` is the right tool.

### The manifest file

`boilerplate.CONFIG` is an `internal` config type — when set, it overrides the framework's default config file discovery. Infrastructure tooling (CI/CD, IaC) can push a `.manifest.yaml` to the working directory containing non-secret deployment metadata:

```yaml title=".manifest.yaml"
boilerplate:
  LOG_LEVEL: info
my_service:
  ENVIRONMENT: production
  REGION: us-east-1
```

The wrapper auto-detects and loads it if present. In environments without a manifest (local dev), the file doesn't exist and nothing changes.

Rule of thumb for config sources:
- Infrastructure generates it → manifest file
- Ops/security manages it → environment variable
- Changes at runtime → custom remote loader (see [Custom Config Loaders](../tutorials/09-custom-config-loader.md))

### Deciding between entrypoints and a wrapper

| Situation | Use |
|---|---|
| Small number of apps, each with their own deployment | Separate entrypoint files per app |
| Monorepo with many services on the same platform | Shared wrapper function in a platform library |
| One app, multiple contexts (local / prod / validate) | Separate entrypoint files per context |
| The same defaults apply to 10+ apps | Wrapper |

The two approaches aren't mutually exclusive. A monorepo can have a shared wrapper while each app still has a `validate.mts` that calls `bootstrapForPlatform` with `VALIDATE_CONFIG: true`.
