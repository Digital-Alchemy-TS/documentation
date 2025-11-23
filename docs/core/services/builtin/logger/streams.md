---
title: Log Streams
---

The Digital Alchemy logger supports multiple output targets, allowing you to send logs to external services while maintaining all the framework's features like ALS integration, pretty formatting, and structured data.

## Adding Log Targets

You can add additional log targets using the `addTarget` method on the logger service. This allows you to send logs to external services like Datadog, Graylog, or custom HTTP endpoints.

### Basic Usage

```typescript
export function MyService({ logger }: TServiceParams) {
  // Add a custom log target
  logger.addTarget((message: string, data: object) => {
    // Send to your custom endpoint
    fetch('https://api.example.com/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, ...data })
    });
  });
}
```

## Datadog Integration Example

Here's a complete example of how to send logs to Datadog with automatic ALS data integration:

```typescript
/**
 * This service should be the very first to execute
 * - all modules depend on this one
 * - declared 1st in priorityInit list
 */
export function LoggerService({ config, logger, internal }: TServiceParams) {
  // This should be explicitly declared as part of the bootstrap configuration
  // Force the var to be loaded asap for early logs
  if (is.empty(config.utils.DATADOG_API_KEY)) {
    logger.debug(`no [DATADOG_API_KEY], stdout logs only`);
    return;
  }

  logger.info(`setting http logs`);

  // https://docs.datadoghq.com/api/latest/logs/#send-logs
  const logIntake = `https://http-intake.logs.datadoghq.com/v1/input/${config.utils.DATADOG_API_KEY}`;

  internal.boilerplate.logger.addTarget((message: string, data: object) => {
    setImmediate(async () => {
      const context = "context" in data ? data.context : undefined;

      await globalThis.fetch(logIntake, {
        body: JSON.stringify({
          logger: { name: context },
          message,
          ...data, // This includes all ALS data automatically!
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    });
  });
}
```

### Key Features of the Datadog Integration

1. **Automatic ALS Data**: The `...data` spread includes all ALS context (request IDs, correlation IDs, timing, etc.)
2. **Async Processing**: Uses `setImmediate` to avoid blocking the main thread
3. **Context Preservation**: Maintains logger context in the Datadog payload
4. **Error Handling**: Gracefully handles missing API keys

## HTTP Request Context with ALS

When combined with the HTTP hooks service, the Datadog integration automatically includes request context:

```typescript
export function HttpHooksService({ logger, als, metrics, context, http, internal: { boot } }: TServiceParams) {

  // ... existing HTTP hooks code ...

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
            storage.logs[key] = http.trace[i];
            keys.push(key);
          }
        });

        logger.debug({ keys }, "onRequest");
      }
    });
  }
}
```

### Resulting Datadog Payload

With both services configured, your Datadog logs will include:

```json
{
  "logger": { "name": "my_app:http_hooks" },
  "message": "Processing request",
  "level": "info",
  "timestamp": 1703123456789,
  "context": "my_app:http_hooks",
  "reqId": "req-12345",
  "correlationId": "corr-67890",
  "startTime": 1703123456000,
  "elapsed": 789,
  "http": {
    "trace": {
      "x-request-id": "req-12345",
      "x-correlation-id": "corr-67890"
    }
  }
}
```

## Custom Log Target Examples

### Graylog Integration

```typescript
export function GraylogService({ logger, config }: TServiceParams) {
  const graylogUrl = config.external.GRAYLOG_URL;

  logger.addTarget((message: string, data: object) => {
    setImmediate(async () => {
      await fetch(graylogUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: '1.1',
          host: process.env.HOSTNAME,
          short_message: message,
          full_message: JSON.stringify(data),
          timestamp: Date.now() / 1000,
          level: data.level || 1,
          _reqId: data.reqId,
          _correlationId: data.correlationId,
          ...data
        })
      });
    });
  });
}
```

### Custom HTTP Endpoint

```typescript
export function CustomLogService({ logger, config }: TServiceParams) {
  const endpoint = config.external.LOG_ENDPOINT;

  logger.addTarget((message: string, data: object) => {
    setImmediate(async () => {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.external.LOG_API_KEY}`
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            message,
            metadata: data
          })
        });
      } catch (error) {
        // Log to console if external logging fails
        console.error('Failed to send log to external service:', error);
      }
    });
  });
}
```

### File-based Logging

```typescript
export function FileLogService({ logger, config }: TServiceParams) {
  const fs = require('fs').promises;
  const logFile = config.logging.FILE_PATH;

  logger.addTarget(async (message: string, data: object) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      ...data
    };

    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
  });
}
```

## Configuration

### Bootstrap Configuration

```typescript
MY_APP.bootstrap({
  configuration: {
    utils: {
      DATADOG_API_KEY: process.env.DATADOG_API_KEY
    },
    external: {
      GRAYLOG_URL: process.env.GRAYLOG_URL,
      LOG_ENDPOINT: process.env.LOG_ENDPOINT,
      LOG_API_KEY: process.env.LOG_API_KEY
    },
    logging: {
      FILE_PATH: '/var/log/myapp/application.log'
    }
  }
});
```

### Environment Variables

```bash
# Datadog
DATADOG_API_KEY=your_datadog_api_key

# Graylog
GRAYLOG_URL=http://graylog:12201/gelf

# Custom endpoint
LOG_ENDPOINT=https://api.example.com/logs
LOG_API_KEY=your_api_key

# File logging
LOG_FILE_PATH=/var/log/myapp/application.log
```

## Best Practices

### 1. Use setImmediate for Async Operations

```typescript
// Good: Non-blocking
logger.addTarget((message: string, data: object) => {
  setImmediate(async () => {
    await sendToExternalService(message, data);
  });
});

// Bad: Blocking
logger.addTarget(async (message: string, data: object) => {
  await sendToExternalService(message, data);
});
```

### 2. Handle Errors Gracefully

```typescript
logger.addTarget((message: string, data: object) => {
  setImmediate(async () => {
    try {
      await sendToExternalService(message, data);
    } catch (error) {
      // Don't let external logging failures break your app
      console.error('External logging failed:', error);
    }
  });
});
```

### 3. Preserve ALS Data

```typescript
// Good: Include all data (including ALS)
logger.addTarget((message: string, data: object) => {
  sendToExternalService(message, data); // data includes ALS context
});

// Bad: Only send message
logger.addTarget((message: string, data: object) => {
  sendToExternalService(message); // Lost ALS context
});
```

### 4. Consider Performance

```typescript
// For high-throughput applications, consider batching
let logBuffer: Array<{message: string, data: object}> = [];

logger.addTarget((message: string, data: object) => {
  logBuffer.push({ message, data });

  if (logBuffer.length >= 100) {
    setImmediate(async () => {
      await sendBatchToExternalService(logBuffer);
      logBuffer = [];
    });
  }
});
```

## Testing Log Targets

```typescript
it("sends logs to external service", async () => {
  await testRunner.run(async ({ logger }) => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    // Add your log target
    logger.addTarget((message: string, data: object) => {
      fetch('https://api.example.com/logs', {
        method: 'POST',
        body: JSON.stringify({ message, ...data })
      });
    });

    // Trigger a log
    logger.info("Test message");

    // Verify the external call was made
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/logs',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Test message')
      })
    );
  });
});
```

## Troubleshooting

### Logs Not Appearing in External Service

1. **Check API keys and endpoints**
2. **Verify network connectivity**
3. **Check for error handling that might be swallowing errors**
4. **Ensure ALS is enabled if you're expecting ALS data**

### Performance Issues

1. **Use `setImmediate` for async operations**
2. **Consider batching for high-volume logging**
3. **Monitor external service response times**
4. **Implement circuit breakers for unreliable external services**

### Missing ALS Data

1. **Ensure ALS is enabled in bootstrap configuration**
2. **Verify ALS context is properly set up**
3. **Check that the log target includes the full data object**
4. **Test with a simple console.log to verify ALS data is present**
