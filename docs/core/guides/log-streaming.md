---
title: Log Streaming
sidebar_position: 6
description: "Stream logs to an external aggregator using addTarget, while keeping stdout intact for local development."
---

In production, you need logs in a centralized place: a log aggregator, an observability platform, or a monitoring service. DA's `addTarget` API makes this a service-level concern — an additional sink that runs alongside the built-in logger, not instead of it.

## What addTarget does

`internal.boilerplate.logger.addTarget` registers a function that receives every log line emitted by the application. It does not replace stdout or any other registered target — all registered sinks receive every log line.

```typescript
internal.boilerplate.logger.addTarget((message: string, data: object) => {
  // message: the formatted log string
  // data: structured log data (level, context, timestamp, etc.)
});
```

Call `addTarget` once during bootstrap (e.g., in a service's top-level body or `onBootstrap` callback). The target is active for the entire lifetime of the process.

## The fire-and-forget pattern

Log delivery should never block the calling code or throw an error that crashes your application. Wrap the delivery call in `setImmediate` so the log method returns immediately:

```typescript
internal.boilerplate.logger.addTarget((message, data) => {
  setImmediate(async () => {
    await deliverToAggregator(message, data);
  });
});
```

`setImmediate` defers execution to the next iteration of the event loop. The log call returns synchronously; delivery happens asynchronously in the background.

## Retry logic

Networks fail. Wrap delivery in a retry loop, but never throw on final failure — a failed log delivery should not crash your application:

```typescript
const MAX_ATTEMPTS = 3;

internal.boilerplate.logger.addTarget((message, data) => {
  setImmediate(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const response = await globalThis.fetch(AGGREGATOR_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({ message, ...data }),
        });

        if (response.ok) break;

        if (attempt === MAX_ATTEMPTS) {
          console.warn(`Log delivery failed after ${attempt} attempts: ${response.status}`);
        }
      } catch (error) {
        if (attempt === MAX_ATTEMPTS) {
          console.warn({ error }, `Log delivery failed after ${attempt} attempts`);
        }
      }
    }
  });
});
```

`console.warn` is used for delivery failures — not the DA logger — to avoid infinite recursion.

## Conditional registration

Only register the target if the aggregator is configured. This keeps stdout-only behavior as the fallback for environments where the aggregator isn't set up:

```typescript
export function LogStreamService({ config, internal }: TServiceParams) {
  const endpoint = config.my_app.LOG_AGGREGATOR_URL;
  const apiKey = config.my_app.LOG_AGGREGATOR_KEY;

  if (!endpoint || !apiKey) {
    // No aggregator configured — stdout only
    return;
  }

  internal.boilerplate.logger.addTarget((message, data) => {
    setImmediate(async () => {
      // ... delivery logic
    });
  });
}
```

## JSON output and suppressing stdout

`loggerOptions.pretty: false` switches the built-in logger to structured JSON output. This is what aggregators expect to index.

If you're shipping all logs via `addTarget` and don't want them also printed to stdout in the deployed environment, set `loggerOptions.stdOut: false`:

```typescript title="src/environments/prod.mts"
await MY_APP.bootstrap({
  loggerOptions: {
    pretty: false,   // JSON output
    stdOut: false,   // don't also print to terminal — aggregator has everything
  },
});
```

In local development, keep both at their defaults (`pretty: true`, `stdOut: true`) — you want readable terminal output. Because the configuration lives in the entrypoint file, not in the service code, there are no conditional checks in `LogStreamService`.

## Tagging every log with mergeData

`loggerOptions.mergeData` merges a static object into every log line. This is how you tag logs with deployment-level metadata: environment name, service name, git commit, instance identifier.

In containerized or orchestrated deployments, `hostname()` from `node:os` gives you the pod/container name, making it easy to correlate log lines with a specific instance:

```typescript title="src/environments/prod.mts"
import { hostname } from "node:os";

await MY_APP.bootstrap({
  loggerOptions: {
    als: true,
    pretty: false,
    mergeData: {
      NODE_ENV: process.env.NODE_ENV,
      host: hostname(),          // container/pod name in orchestrated deployments
      service: "my-api",
      version: process.env.APP_VERSION,
    },
  },
});
```

Every log line emitted by the application — whether from your services, the framework, or libraries — will include these fields.

In local development, `mergeData` is usually not needed. The terminal output is already namespaced by service context. Save it for environments where logs from many instances land in the same aggregator and you need to filter by `host` or `service`.

## ALS: per-request context in every log line

`loggerOptions.als: true` integrates with DA's Async Local Storage extension. When you set context data on an incoming HTTP request (request ID, user ID, trace ID), that data is automatically merged into every log line emitted within that request's async execution context — including calls to services you didn't write.

```typescript title="src/services/http.service.mts"
export function HttpService({ hass, internal, lifecycle }: TServiceParams) {
  lifecycle.onReady(() => {
    server.addHook("onRequest", (request, reply, done) => {
      internal.boilerplate.als.set({
        requestId: request.headers["x-request-id"],
        userId: request.headers["x-user-id"],
      });
      done();
    });
  });
}
```

With `als: true`, every log emitted during that request's lifecycle includes `requestId` and `userId` — no manual passing of context objects. See [Async Local Storage](../advanced/async-local-storage.md) for the full setup.

## Full example

```typescript title="src/services/log-stream.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

const MAX_ATTEMPTS = 3;

export function LogStreamService({ config, context, internal, logger }: TServiceParams) {
  const endpoint = config.my_app.LOG_AGGREGATOR_URL;
  const apiKey = config.my_app.LOG_AGGREGATOR_KEY;

  if (!endpoint || !apiKey) {
    logger.debug("no log aggregator configured, using stdout only");
    return;
  }

  internal.boilerplate.logger.addTarget((message, data) => {
    setImmediate(async () => {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const response = await globalThis.fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ message, ...data }),
          });

          if (response.ok) break;

          if (attempt === MAX_ATTEMPTS) {
            console.warn(
              `[${context}] log delivery failed after ${attempt} attempts: HTTP ${response.status}`,
            );
          }
        } catch (error) {
          if (attempt === MAX_ATTEMPTS) {
            console.warn(
              `[${context}] log delivery failed after ${attempt} attempts`,
              error,
            );
          }
        }
      }
    });
  });

  logger.info("log streaming active");
}
```

Config entries for this service:

```typescript
LOG_AGGREGATOR_URL: {
  type: "string",
  description: "HTTP log ingest endpoint. If unset, logs go to stdout only.",
},
LOG_AGGREGATOR_KEY: {
  type: "string",
  source: ["env"],  // never from a config file
},
```

## Summary

| Goal | How |
|---|---|
| Add a log sink without replacing stdout | `addTarget` |
| Never block on log delivery | Wrap in `setImmediate` |
| Handle transient failures | Retry loop; `console.warn` on final failure |
| JSON output for aggregators | `loggerOptions.pretty: false` |
| Skip stdout in deployed environments | `loggerOptions.stdOut: false` |
| Tag every log with deployment metadata | `loggerOptions.mergeData` |
| Per-request context in logs | `loggerOptions.als: true` + ALS setup |

For the full `loggerOptions` field reference, see [Project Tuning](../advanced/project-tuning.md).
