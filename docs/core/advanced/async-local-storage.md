---
title: AsyncLocalStorage (ALS)
---

AsyncLocalStorage (ALS) is a Node.js feature that allows you to store data that is accessible throughout an entire async operation chain, without explicitly passing it through every function call. The Digital Alchemy framework provides special support for ALS to enable request-level context tracking and correlation.

Think of it as a "thread-local storage" for async operations - data stored in ALS is automatically available to all code that runs within the same async context, regardless of how deep the call stack goes.

## How ALS Works in the Framework

### 1. ALS Service

The framework provides an ALS service that manages the storage context:

```typescript
type AlsExtension = {
  asyncStorage: () => AsyncLocalStorage<AsyncLocalData>;
  getStore: () => AsyncLocalData;
  run(data: AsyncLocalData, callback: () => TBlackHole): void;
  enterWith(data: AsyncLocalData): void;
  getLogData: () => AsyncLogData;
};
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

##

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
