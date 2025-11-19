---
title: Logger
id: core_logging
sidebar_position: 0
description: ""
---

The provided logger is a standardized interface that wraps the Node.js console object.
By default it tries to emit pretty logs for human readability, but it can be augmented in a number of ways to alter behavior.

## Features

- **Pretty formatting** with color-coded output
- **Structured logging** with object support
- **Log level management** with per-service overrides
- **AsyncLocalStorage (ALS) integration** for request context tracking
- **Multiple output targets** for external logging services
- **Performance timing** integration
- **Context management** for service identification

## Quick Start

```typescript
export function MyService({ logger }: TServiceParams) {
  logger.info("Service started");
  logger.debug({ userId: 123 }, "Processing user request");
  logger.error("Something went wrong");
}
```

## Documentation Sections

- **[API Reference](./api.md)** - Complete logger interface and usage
- **[Log Streams](./streams.md)** - External logging targets (Datadog, Graylog, etc.)
