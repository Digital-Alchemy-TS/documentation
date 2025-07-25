---
title: Custom Loggers
---

Digital Alchemy supports complete logger replacement through the bootstrap options. This allows you to integrate third-party logging libraries or create custom formatting while maintaining the framework's logging infrastructure.

## Overview

You can replace the built-in logger by providing a `customLogger` in your bootstrap options. Your custom logger must implement the `ILogger` interface and will receive the same context and data as the built-in logger.

## Interface Requirements

Your custom logger must implement these methods:

```typescript
interface ILogger {
  debug(context: TContext, ...params: Parameters<TLoggerFunction>): void;
  error(context: TContext, ...params: Parameters<TLoggerFunction>): void;
  fatal(context: TContext, ...params: Parameters<TLoggerFunction>): void;
  info(context: TContext, ...params: Parameters<TLoggerFunction>): void;
  trace(context: TContext, ...params: Parameters<TLoggerFunction>): void;
  warn(context: TContext, ...params: Parameters<TLoggerFunction>): void;
}
```

Each method receives:
1. **Context**: The service context (e.g., `"my_app:user_service"`)
2. **Parameters**: Either a data object, message string, or both

## JSON Formatter Example

Create a simple JSON formatter that outputs all data in JSON format:

```typescript
import { ILogger } from "@digital-alchemy/core";

const jsonLogger: ILogger = {
  debug: (context, ...params) => formatAndLog("debug", context, ...params),
  error: (context, ...params) => formatAndLog("error", context, ...params),
  fatal: (context, ...params) => formatAndLog("fatal", context, ...params),
  info: (context, ...params) => formatAndLog("info", context, ...params),
  trace: (context, ...params) => formatAndLog("trace", context, ...params),
  warn: (context, ...params) => formatAndLog("warn", context, ...params),
};

function formatAndLog(level: string, context: string, ...params: unknown[]) {
  const [data, message, ...args] = params;

  const logEntry = {
    level,
    context,
    timestamp: new Date().toISOString(),
    message: typeof data === "object" ? message : data,
    data: typeof data === "object" ? data : undefined,
    args: args.length > 0 ? args : undefined,
  };

  // Remove undefined fields for cleaner output
  const cleanEntry = Object.fromEntries(
    Object.entries(logEntry).filter(([_, value]) => value !== undefined)
  );

  console.log(JSON.stringify(cleanEntry));
}

await app.bootstrap({
  customLogger: jsonLogger,
});
```

## Pino Integration

**Reference Implementation**: [pino-binding.ts](https://gist.githubusercontent.com/zoe-codez/33daa39b90f42aa5d3e97d6b9e5f7cc2/raw/81781eb7be1ba54cd386c3c5c69ec5ff933cb65f/pino-binding.ts)

This gist contains a complete Pino logger integration with proper parameter handling and bootstrap configuration.

## Usage

With your custom logger, your services work exactly the same:

```typescript
export function UserService({ logger }: TServiceParams) {
  logger.info("User service started");
  logger.debug({ userId: 123 }, "User logged in");
  logger.error({ error: new Error("DB failed") }, "Failed to process request");
}
```

## Benefits

- **Performance**: Use high-performance logging libraries like Pino
- **Integration**: Connect to external logging services (Datadog, Graylog, etc.)
- **Formatting**: Custom output formats for different environments
- **Structured Data**: Enhanced structured logging capabilities
- **Compatibility**: Maintain framework logging patterns while using your preferred logger

## Important Notes

- The framework still handles log level filtering based on `LOG_LEVEL` configuration
- Your custom logger receives the context as the first parameter
- You can access the base logger via `internal.boilerplate.logger.getBaseLogger()`
- You can modify the logger at runtime using `internal.boilerplate.logger.setBaseLogger()`
