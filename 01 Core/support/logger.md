## Description

- #TServiceParams/logger

The provided logger is a standardized interface that wraps the nodejs console object. It is aware of the service it was provided to. The underlying logging interface can be swapped out for other drivers (recommend [pino](https://www.npmjs.com/package/pino)) for more customized functionality.

## API

The logger is able to take in both objects, and strings in order to generate log messages. The interface looks like this, with :

`logger.method([data],[message[, ...format strings]])`

Breaking it down a bit

> [!example] #Usage-Example/core/logger

```typescript
export function MyService({ logger }: TServiceParams) {
  
  // log a simple string
  logger.info("log message");
  
  // log an object
  logger.info({ data: { foo: "bar" } });
  
  // log an object with a message
  logger.info({ data: { foo: "bar" } }, `some text`);
}
```

Both objects and strings are allowed as the 1st parameter, but object must come first is both are provided. All arguments after that are consumed as a spread, and are passed through to [util.format](https://nodejs.org/api/util.html#utilformatformat-args) to further format the message text. 

| symbol | use                                          |
| ------ | -------------------------------------------- |
| `%s`   | string                                       |
| `%d`   | number                                       |
| `%i`   | parseInt                                     |
| `%f`   | parseFloat                                   |
| `%j`   | JSON                                         |
| `%o`   | object (including non-enumerable properties) |
| `%O`   | object                                       |
| `%c`   | css (unused by node)                         |
| `%%`   | plain `%` symbol, does not consume arg       |
## Reference Log

> [!example] Below is a block of logs intended to show the general rules for formatting
> 
> - **General format**
> `[TIMESTAMP]`  `[project:service]` `(name)`: `message`
>   ... `extra object data`
  >   ... `extra object data`

![[example_log.png]]

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

## Log Levels

- #config/boilerplate/LOG_LEVEL

This table describes the priority order (highest -> lowest) of log levels, and the color provided to the `context`. Setting the `LOG_LEVEL` to a higher level will cause the lower level ones to not be emitted.

| log level | color   |
| --------- | ------- |
| `fatal`   | magenta |
| `error`   | red     |
| `warn`    | yellow  |
| `info`    | green   |
| `debug`   | blue    |
| `trace`   | gray    |
Unless changed, log levels will default to `trace`. Providing `boilerplate.LOG_LEVEL` as a bootstrap configuration value can affect the logger from the very start of bootstrap.

> [!attention] Level may change through app lifecycle
> Values sourced from the user config will only affect the logger after the configuration step. This could result in lots of trace logs at the very start, then having them stop part way through bootstrap as the configurations update
