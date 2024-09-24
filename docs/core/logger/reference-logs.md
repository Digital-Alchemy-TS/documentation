---
title: 📑 Reference Log
---

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
