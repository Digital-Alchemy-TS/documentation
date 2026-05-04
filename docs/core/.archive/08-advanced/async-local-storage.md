---
title: Async Local Storage
sidebar_position: 3
description: "Using AsyncLocalStorage for request-scoped data and log correlation."
---

AsyncLocalStorage (ALS) is a Node.js built-in that stores data accessible throughout an entire async call chain — without passing it explicitly through every function. Digital Alchemy wraps it as the `als` service on `TServiceParams`.

Think of it as "thread-local storage" for async operations: data stored in ALS is automatically available to all code that runs within the same async context, no matter how deep the call stack.

## The als service

```typescript
type AlsExtension = {
  asyncStorage: () => AsyncLocalStorage<AsyncLocalData>;
  getStore:     () => AsyncLocalData | undefined;
  getLogData:   () => AsyncLogData;
  run:          (data: AsyncLocalData, callback: () => void) => void;
  enterWith:    (data: AsyncLocalData) => void;
};
```

## ALS data structure

```typescript
interface AsyncLocalData {
  logs: AsyncLogData;
  http?: RequestLocals;   // optional — for HTTP request tracking
}

interface AsyncLogData {
  reqId?:         string;
  correlationId?: string;
  startTime?:     number;
  [key: string]:  unknown;
}
```

## Usage

### Running code within an ALS context

```typescript
export function HttpMiddleware({ als }: TServiceParams) {
  return (req, res, next) => {
    als.run({
      logs: {
        reqId:         crypto.randomUUID(),
        correlationId: req.headers["x-correlation-id"],
        startTime:     Date.now(),
      },
    }, next);
  };
}
```

Any code that runs within the `als.run(...)` callback — including deeply nested async operations — can read this data:

```typescript
export function DatabaseService({ als, logger }: TServiceParams) {
  return {
    query: async (sql: string) => {
      const { reqId } = als.getLogData();
      logger.debug({ reqId, sql }, "executing query");
      // ...
    },
  };
}
```

### Enabling ALS in the logger

With `loggerOptions: { als: true }` at bootstrap, the logger automatically includes ALS data (`reqId`, `correlationId`, timing) in every log line emitted within the ALS context:

```typescript
await MY_APP.bootstrap({
  loggerOptions: { als: true },
});
```

### Reading current context

```typescript
const store    = als.getStore();      // full AsyncLocalData or undefined
const logData  = als.getLogData();    // AsyncLogData (empty object if no context)
```

### enterWith

Sets the current context without wrapping in a callback. Useful for top-level scripts or one-time setup, but generally `run()` is preferred for request handling:

```typescript
als.enterWith({ logs: { jobId: "batch-001" } });
```

## When to use ALS

ALS is most valuable for:
- HTTP servers — correlate all logs for a single request with a shared `reqId`
- Batch jobs — tag all logs for a job run with a `jobId`
- Distributed tracing — propagate a `traceId` through a service call chain

For applications that don't handle concurrent requests (scripts, automations), ALS adds complexity without much benefit and can be ignored entirely.
