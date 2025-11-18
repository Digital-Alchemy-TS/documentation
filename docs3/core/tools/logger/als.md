---
title: AsyncLocalStorage (ALS)
---

AsyncLocalStorage (ALS) is a Node.js feature that allows you to store data that is accessible throughout an entire async operation chain, without explicitly passing it through every function call. The Digital Alchemy framework provides special support for ALS to enable request-level context tracking and correlation.

## What is AsyncLocalStorage?

AsyncLocalStorage creates isolated storage contexts that persist across async operations. Think of it as a "thread-local storage" for async operations - data stored in ALS is automatically available to all code that runs within the same async context, regardless of how deep the call stack goes.

## Why ALS in Digital Alchemy?

The framework provides special ALS support to solve common distributed tracing and logging challenges:

- **Request Correlation**: Track request IDs, correlation IDs, and other context across all async operations
- **Contextual Logging**: Automatically include request context in all log messages
- **Performance Tracking**: Measure timing across complex async operations
- **Debugging**: Maintain context across third-party library calls

## How ALS Works in the Framework

### 1. ALS Service

The framework provides an ALS service that manages the storage context:

```typescript
export function ALS(): AlsExtension {
  const storage = new AsyncLocalStorage<AsyncLocalData>();
  return {
    asyncStorage: () => storage,
    enterWith(data) {
      storage.enterWith(data);
    },
    getLogData: () => storage.getStore()?.logs ?? ({} as AsyncLogData),
    getStore: () => storage.getStore(),
    run(data: AsyncLocalData, callback: () => TBlackHole) {
      storage.run(data, () => {
        callback();
      });
    },
  };
}
```

### 2. Logger Integration

When ALS is enabled in logger configuration, the framework automatically:

- Extracts ALS data from the current context
- Merges it into log messages
- Provides timing information if available

```typescript
MY_APP.bootstrap({
  loggerOptions: {
    als: true  // Enable ALS integration
  }
});
```

## Practical Usage Examples

### HTTP Request Context Tracking

Here's how to use ALS with Fastify to track request context:

```typescript
export function HttpHooksService({ logger, als, metrics, context, http, internal: { boot } }: TServiceParams) {

  async function gatherLocals(req: FastifyRequest): Promise<RequestLocals> {
    logger.trace({ name: gatherLocals }, "gathering data");
    const trace: Partial<Record<RequestHeaders, string>> = {};

    // Track down expected headers + ensure presence
    Object.values(RequestHeaders).forEach(i => {
      const value = req.headers[i];
      if (REQUIRED_HEADERS.has(i) && is.undefined(value)) {
        throw new BadRequestError(context, `Missing expected header: ${i}`);
      }
      if (is.undefined(value)) {
        return;
      }
      trace[i] = value.toString();
    });

    return {
      trace,
    };
  }

  async function setup(fastify: FastifyInstance) {
    fastify.addHook("onRequest", async (req, res) => {
      // Merge request data into storage
      const http = await gatherLocals(req);
      const storage = als.getStore();

      if (storage) {
        res.header(ResponseHeaders.requestId, storage.logs.reqId);
        storage.http = http;

        // Extract keys that are supposed to be in logs and append there also
        const keys: string[] = [];
        is.keys(http.trace).forEach(i => {
          const key = ALS_HEADER_LOGS.get(i);
          if (key && key !== "logger") {
            // @ts-expect-error unclear typing causing this
            storage.logs[key] = http.trace[i];
            keys.push(key);
          }
        });

        logger.debug({ keys }, "onRequest");
      }
    });
  }

  return { setup };
}
```

### Manual ALS Usage

You can also manually manage ALS contexts:

```typescript
export function MyService({ logger, als }: TServiceParams) {

  async function processRequest(reqId: string, correlationId: string) {
    // Enter a new ALS context
    als.enterWith({
      logs: {
        reqId,
        correlationId,
        startTime: Date.now()
      }
    });

    // All logs within this context will automatically include the ALS data
    logger.info("Processing request");

    // You can also access ALS data directly
    const logData = als.getLogData();
    logger.debug({ elapsed: Date.now() - logData.startTime }, "Request processing complete");
  }

  return { processRequest };
}
```

## ALS Data Structure

The framework expects ALS data to follow this structure:

```typescript
interface AsyncLocalData {
  logs: AsyncLogData;
  http?: RequestLocals;
}

interface AsyncLogData {
  reqId?: string;
  correlationId?: string;
  startTime?: number;
  [key: string]: unknown;
}
```

## Best Practices

### 1. Always Use Request IDs

```typescript
// Good: Include request ID in ALS
als.enterWith({
  logs: {
    reqId: generateRequestId(),
    correlationId: req.headers['x-correlation-id']
  }
});

// Bad: No request tracking
als.enterWith({
  logs: {}
});
```

### 2. Include Timing Information

```typescript
als.enterWith({
  logs: {
    reqId: reqId,
    startTime: Date.now()
  }
});
```

### 3. Use Correlation IDs for Distributed Tracing

```typescript
// Extract from headers or generate
const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();

als.enterWith({
  logs: {
    reqId: reqId,
    correlationId: correlationId
  }
});
```

### 4. Clean Up After Operations

```typescript
// ALS contexts are automatically cleaned up when the async operation completes
// No manual cleanup required
```

## Integration with External Services

ALS data is automatically included when you add external log targets (like Datadog). The framework ensures that all ALS context is preserved and forwarded to external logging systems.

## Debugging ALS

To debug ALS issues, you can:

1. **Check if ALS is enabled**:
```typescript
logger.debug({ alsEnabled: !!als.getStore() }, "ALS status");
```

2. **Inspect current ALS data**:
```typescript
const logData = als.getLogData();
logger.debug({ logData }, "Current ALS data");
```

3. **Verify ALS integration**:
```typescript
// This log should include ALS data if properly configured
logger.info("Test log with ALS");
```

## Common Pitfalls

### 1. Forgetting to Enable ALS

```typescript
// Make sure ALS is enabled in bootstrap
MY_APP.bootstrap({
  loggerOptions: {
    als: true  // Don't forget this!
  }
});
```

### 2. Not Using ALS in Async Operations

```typescript
// Good: ALS context is maintained
async function processData() {
  logger.info("Processing"); // Includes ALS data
  await someAsyncOperation();
  logger.info("Complete"); // Still includes ALS data
}

// Bad: ALS context might be lost
setTimeout(() => {
  logger.info("Timeout"); // May not include ALS data
}, 1000);
```

### 3. Mixing ALS and Non-ALS Logging

```typescript
// Good: Consistent ALS usage
logger.info("All logs use ALS");

// Bad: Mixing approaches
console.log("Direct console - no ALS");
logger.info("ALS enabled");
```

## Performance Considerations

- ALS has minimal performance impact
- Context switching is very fast
- Memory usage is proportional to the amount of data stored
- Consider the size of data stored in ALS for high-throughput applications
