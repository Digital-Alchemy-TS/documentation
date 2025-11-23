---
title: API
---

The Digital Alchemy logger is automatically injected into every service, providing a powerful and flexible logging interface with built-in context awareness and formatting capabilities.

## Getting the Logger

The logger is automatically available in every service through dependency injection:

```typescript
export function MyService({ logger }: TServiceParams) {
  // Your logger is ready to use!
  logger.info("Service started successfully");
}
```

## Automatic Context

Every logger instance automatically includes context information about your service:

- **Service Context**: Automatically set to `{project}:{service}` (e.g., `my_app:user_service`)
- **Color Coding**: Context is color-coded based on the log level for easy visual identification
- **Structured Data**: Context is included in all log messages for filtering and analysis

```typescript
export function UserService({ logger }: TServiceParams) {
  // This log will automatically include context: "my_app:user_service"
  logger.info("Processing user request");

  // Output: [INFO] [my_app:user_service] Processing user request
}
```

## Logging Interface

The logger supports flexible parameter combinations for different logging needs:

```typescript
export function MyService({ logger }: TServiceParams) {

  // Simple string message
  logger.info("User logged in successfully");

  // Object data only
  logger.debug({ userId: 123, action: "login" });

  // String message with object data
  logger.info({ userId: 123 }, "User %s logged in", "john.doe");

  // Object data with formatted message
  logger.error(
    { error: "Database connection failed" },
    "Failed to process request: %s",
    methodName
  );
}
```

### Parameter Order

The logger follows this parameter order:
1. **Data object** (optional) - Structured data to include
2. **Message string** (optional) - Human-readable message
3. **Format arguments** (optional) - Values for string formatting

## String Formatting

When you provide a message string, you can use format specifiers that work with Node.js `util.format`:

```typescript
logger.info("User %s logged in from %s", username, ipAddress);
logger.debug("Processing %d items, %s remaining", processed, remaining);
logger.error("API call failed with status %d: %s", statusCode, errorMessage);
```

| Format Specifier | Description | Example |
|------------------|-------------|---------|
| `%s` | String | `"hello"` |
| `%d` | Number | `42` |
| `%i` | Integer | `42` |
| `%f` | Float | `3.14` |
| `%j` | JSON | `{"key": "value"}` |
| `%o` | Object (detailed) | `{key: "value"}` |
| `%O` | Object (simple) | `{key: "value"}` |
| `%%` | Literal `%` | `%` |

## Log Levels

The logger provides six log levels, each with specific use cases and visual styling:

| Level | Color | Priority | Use Case | Example |
|-------|-------|----------|----------|---------|
| `fatal` | 🟣 Magenta | Highest | Application crashes, unrecoverable errors | Database corruption, system shutdown |
| `error` | 🔴 Red | High | Recoverable errors, failed operations | API failures, validation errors |
| `warn` | 🟡 Yellow | Medium | Potential issues, deprecation warnings | Rate limiting, deprecated API usage |
| `info` | 🟢 Green | Normal | General application flow | User actions, service startup |
| `debug` | 🔵 Blue | Low | Detailed debugging information | Function entry/exit, data transformations |
| `trace` | ⚪ Gray | Lowest | Very detailed debugging | Internal state, performance metrics |

### When to Use Each Level

```typescript
export function UserService({ logger }: TServiceParams) {

  // trace: Very detailed debugging
  logger.trace({ userId: 123, step: "validation" }, "Validating user input");

  // debug: Detailed debugging
  logger.debug({ userId: 123 }, "Processing user request");

  // info: General application flow
  logger.info({ userId: 123 }, "User %s logged in successfully", username);

  // warn: Potential issues
  logger.warn({ userId: 123 }, "User attempted to access restricted resource");

  // error: Recoverable errors
  logger.error({ userId: 123, error: "Invalid credentials" }, "Login failed");

  // fatal: Unrecoverable errors
  logger.fatal({ error: "Database corruption detected" }, "Application must shutdown");
}
```

## Bootstrap Configuration Options

You can customize logger behavior through bootstrap options:

```typescript
MY_APP.bootstrap({
  loggerOptions: {
    // Enable ALS integration for request context tracking
    als: true,

    // Add global data to all logs
    mergeData: {
      service: "my-app",
      version: "1.0.0",
      environment: process.env.NODE_ENV
    },

    // Custom timestamp format
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",

    // Disable pretty formatting (useful for machine parsing)
    pretty: false,

    // Show milliseconds since last log
    ms: true,

    // Add incrementing counter to each log
    counter: true,

    // Disable stdout output (useful when using external log targets)
    stdOut: false,

    // Override log levels for specific services/modules
    levelOverrides: {
      "boilerplate": "silent",        // Silence framework logs
      "my_app": "info",               // Set app default
      "my_app:debug_service": "trace" // Enable trace for specific service
    }
  }
});
```

### Configuration Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `als` | `boolean` | `false` | Enable AsyncLocalStorage integration for request context |
| `mergeData` | `object` | `{}` | Global data to include in all log messages |
| `timestampFormat` | `string` | `"ddd HH:mm:ss.SSS"` | Timestamp format using dayjs syntax |
| `pretty` | `boolean` | `true` | Enable pretty formatting with colors and symbols |
| `ms` | `boolean` | `false` | Show milliseconds since last log message |
| `counter` | `boolean` | `false` | Add incrementing counter to each log |
| `stdOut` | `boolean` | `true` | Output logs to console/stdout |
| `levelOverrides` | `object` | `{}` | Per-service/module log level overrides |

### Environment-Based Configuration

You can also control logging through environment variables:

```bash
# Set global log level
LOG_LEVEL=info

# Disable pretty formatting in production
NODE_ENV=production
```

## Pretty Formatting Features

When `pretty: true` (default), the logger provides enhanced visual formatting:

- **Color-coded contexts** for easy service identification
- **Highlighted symbols** like `[INFO]`, `[ERROR]`
- **Formatted timestamps** with consistent styling
- **Structured data** with proper indentation
- **Performance timing** when `ms: true` is enabled

### Example Output

```
+12.34ms [Mon 14:30:45.123] [INFO] [my_app:user_service] User john.doe logged in successfully
+1.23ms  [Mon 14:30:45.124] [DEBUG] [my_app:user_service] Session created: abc123
+0.45ms  [Mon 14:30:45.125] [ERROR] [my_app:auth_service] Invalid token provided
```

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// Good: Clear level progression
logger.trace("Entering function");
logger.debug("Processing data");
logger.info("Operation completed");
logger.warn("Deprecated method called");
logger.error("Operation failed");

// Bad: Inconsistent levels
logger.info("Debug information"); // Should be debug
logger.error("Minor warning");     // Should be warn
```

### 2. Include Relevant Context

```typescript
// Good: Rich context
logger.info({ userId: 123, action: "login", ip: "192.168.1.1" }, "User logged in");

// Bad: Minimal context
logger.info("User logged in");
```

### 3. Use Structured Data

```typescript
// Good: Structured for analysis
logger.error({
  error: "Database connection failed",
  retryCount: 3,
  lastAttempt: new Date().toISOString()
}, "Failed to connect to database");

// Bad: String concatenation
logger.error("Failed to connect to database after 3 attempts");
```

### 4. Leverage Format Specifiers

```typescript
// Good: Clean formatting
logger.info("Processing %d items for user %s", itemCount, username);

// Bad: String concatenation
logger.info("Processing " + itemCount + " items for user " + username);
```

## Integration with External Services

The logger integrates seamlessly with external logging services. See the [Log Streams](./streams.md) documentation for examples with Datadog, Graylog, and other services.
