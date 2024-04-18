---
title: Core/Logger
---

## 📚 Description

The provided logger is a standardized interface that wraps the Node.js console object. It is aware of the service it was provided to. The underlying logging interface can be swapped out for other drivers (recommended [pino](https://www.npmjs.com/package/pino)) for more customized functionality.

## 📖 API

The logger is able to take in both objects and strings in order to generate log messages. The interface looks like this:

`logger.method([data],[message[, ...format strings]])`

> A few examples of how parameters can be passed into the logger

```typescript
export function MyService({ logger }: TServiceParams) {

  // Log a simple string
  logger.info("log message");

  // Log an object
  logger.info({ data: { foo: "bar" } });

  // Log an object with a message
  logger.info({ data: { foo: "bar" } }, `some text`);
}
```

Both objects and strings are allowed as the 1st parameter, but the object must come first if both are provided. All arguments after that are consumed as a spread and are passed through to [util.format](https://nodejs.org/api/util.html#utilformatformat-args) to further format the message text.

| Symbol | Use                                          |
| ------ | -------------------------------------------- |
| `%s`   | String                                       |
| `%d`   | Number                                       |
| `%i`   | parseInt                                     |
| `%f`   | parseFloat                                   |
| `%j`   | JSON                                         |
| `%o`   | Object (including non-enumerable properties) |
| `%O`   | Object                                       |
| `%c`   | CSS (unused by Node)                         |
| `%%`   | Plain `%` symbol, does not consume an arg    |

## 📑 Reference Log

```typescript
export function Example({ logger }: TServiceParams) {
  const context = "example logs";
  logger.info(
    { context },
    `some text [%s]`,
    `with a highlighted block of text`,
  );
  logger.info({ context }, `some text {%s}`, `differently highlighted text`);
  logger.info(
    { context },
    `[%s] > [%s] > [%s] > [%s]`,
    `Step 1`,
    "Step 2",
    "???",
    "Profit",
  );
  logger.trace({ context }, ` - trace`);
  logger.debug({ context }, ` - debug`);
  logger.info({ context }, ` - info`);
  logger.warn({ context }, ` - warn`);
  logger.error({ context }, ` - error`);
  logger.fatal({ context }, ` - fatal`);
  logger.info({ context }, `some#text`);
  logger.info({ context, name: "name" }, `log message with a name`);
  // If you don't override the context, it uses project:service
  logger.info({
    big_number: 123456789,
    deeply: {
      nested: {
        object: {
          here: true,
        },
      },
    },
    foo: "bar",
    stop: ["🔨", "hammer", "time"],
  });
  try {
    throw new Error("BIG MEAN ERROR");
  } catch (error) {
    logger.error({ context, error }, `logged error`);
  }
}
```

> **TLDR**: Below is a block of logs intended to show the general rules for formatting
>
> - **General format**
> `[TIMESTAMP]`  `[project:service]` `(name)`: `message`
>   ... `extra object data`
>   ... `extra object data`

![example_log](/img/example_log.png)

## 🔊 Log Levels

- [LOG_LEVEL](/core/config/LOG_LEVEL)

This table describes the priority order (highest -> lowest) of log levels and the color provided to the `context`. Setting the `LOG_LEVEL` to a higher level will cause the lower-level ones to not be emitted.

| Log Level | Color   |
| --------- | ------- |
| `fatal`   | Magenta |
| `error`   | Red     |
| `warn`    | Yellow  |
| `info`    | Green   |
| `debug`   | Blue    |
| `trace`   | Gray    |

Unless changed, log levels will default to `trace`. Providing `boilerplate.LOG_LEVEL` as a bootstrap configuration value can affect the logger from the very start of the bootstrap.

> **Attention**: The level may change through the app lifecycle
> Values sourced from the user config will only affect the logger after the configuration step. This could result in lots of trace logs at the very start, then having them stop partway through bootstrap as the configurations update.

### Log level printing

By default, log levels will be be prefixed to contexts in order to preserve information where colors may not be available. If you prefer to only utilize colors in your setup, there is a flag to disable this functionality as part of bootstrap params
