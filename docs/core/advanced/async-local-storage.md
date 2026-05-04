---
title: Async Local Storage
sidebar_position: 2
description: "AlsExtension, AsyncLocalData, and the HTTP middleware correlation pattern."
---

`als` on `TServiceParams` wraps Node.js's [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html). It provides a way to attach contextual data that propagates automatically through the entire async call stack without passing it explicitly as a parameter.

## AlsExtension API

```typescript
type AlsExtension = {
  run(data: AsyncLocalData, callback: () => void): void;
  getStore(): AsyncLocalData | undefined;
  getLogData(): AsyncLogData;
  enterWith(data: AsyncLocalData): void;
  asyncStorage(): AsyncLocalStorage<AsyncLocalData>;
};
```

### `als.run(data, callback)`

Creates a new async context with the given data. All async operations initiated within `callback` will have access to `data` via `als.getStore()`.

```typescript
als.run({ logs: { correlationId: "abc-123" } }, () => {
  // Every async call chain that starts here can access correlationId
  doAsyncWork();
});
```

### `als.getStore()`

Returns the current `AsyncLocalData` for the active async context, or `undefined` if not in a context.

```typescript
const store = als.getStore();
const correlationId = store?.logs?.correlationId;
```

### `als.getLogData()`

Shortcut for `als.getStore()?.logs ?? {}`. Returns the `AsyncLogData` — the data that the logger uses for automatic context merging.

### `als.enterWith(data)`

Sets the ALS data for the current context without creating a new scope. Mutates the current context rather than creating a child. Use with care — unlike `run()`, this isn't scoped.

## AsyncLocalData and AsyncLogData

```typescript
interface AsyncLogData {
  duration?: () => number;  // returns ms since entry — appended to log lines
  logger?: GetLogger;       // thread-local child logger override
}

interface AsyncLocalData {
  logs: AsyncLogData;
}
```

The `logs` property is special: when `loggerOptions.als: true` is set, the logger automatically merges `als.getLogData()` into every log line. This is how log data flows from ALS into your structured logs without any explicit passing.

To extend `AsyncLocalData` with your own fields, use declaration merging:

```typescript
declare module "@digital-alchemy/core" {
  export interface AsyncLocalData {
    logs: AsyncLogData;      // keep the existing field
    requestId?: string;      // add your own
    userId?: string;
  }
}
```

## The HTTP middleware pattern

The primary use case for ALS is attaching request-scoped context in HTTP servers. When a request arrives, you start an ALS context with the request's metadata (correlation ID, request ID, user ID, trace ID). Every service called during that request's handling can access that context — and the logger includes it in every log line automatically.

This gives you structured logs with zero-effort correlation across the entire request call chain.

Here's a sketch using Express (the real code works similarly with Fastify, Koa, etc.):

```typescript title="src/middleware.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export function MiddlewareService({ als }: TServiceParams) {
  return function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers["x-correlation-id"] ?? randomUUID();
    const requestId = randomUUID();

    // Start an ALS context for this request
    // Every async call that originates from next() inherits this context
    als.run(
      {
        logs: {
          // These fields automatically appear in every log line
          // (when loggerOptions.als: true is set in bootstrap)
        },
        correlationId,
        requestId,
      },
      () => {
        // Attach to response for end-to-end tracing
        res.setHeader("x-correlation-id", correlationId);
        res.setHeader("x-request-id", requestId);
        next();
      }
    );
  };
}
```

```typescript title="src/users.service.mts"
export function UsersService({ logger, als }: TServiceParams) {
  return {
    getUser: async (id: string) => {
      // No need to pass correlationId — it's in the ALS context
      // If loggerOptions.als: true, this log line automatically includes
      // the correlationId and requestId from the middleware above
      logger.info({ userId: id }, "fetching user");

      // Alternatively, read it explicitly:
      const store = als.getStore();
      const correlationId = store?.correlationId;

      return fetchUser(id);
    },
  };
}
```

```typescript title="src/main.mts"
await MY_APP.bootstrap({
  loggerOptions: {
    als: true,         // merge ALS log data into every log line
    mergeData: {
      env: "production",
      service: "my-api",
    },
  },
});
```

With this setup, every log line emitted within a request handler automatically includes the correlation ID and request ID — without any service needing to thread them through as parameters.

## Declare your ALS fields

To get TypeScript types on your custom ALS data, extend `AsyncLocalData`:

```typescript
declare module "@digital-alchemy/core" {
  export interface AsyncLocalData {
    logs: AsyncLogData;
    correlationId?: string;
    requestId?: string;
    userId?: string;
  }
}
```

After this, `als.getStore()?.correlationId` is typed as `string | undefined`.

## AlsHook

For libraries that want to contribute data to the ALS context without requiring the application to set it up manually, declare an `AlsHook`:

```typescript
type AlsHook = () => object;
```

This is an extension point for framework-level libraries. Application code generally doesn't need it.
