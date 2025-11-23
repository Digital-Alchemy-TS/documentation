---
title: Configuration
---

By default, the test runner **WILL NOT** utilize **ANY** config loader

It will not know or care about:
- your `.env` file
- the current state of `process.env`
- that ini file
- any value outside of module declared default

## Overriding module configs

`@digital-alchemy` utilizes the `config` object for both key storage, as well as logic gates.

You can override these in 2 primary ways:

### .configure

Hard coded overrides to module values.
This is equivalent to providing values at `.bootstrap` in priority

```typescript
testRunner.configure({
  synapse: {
    // don't touch my real database!
    SQLITE_DB: join(cwd(), "jest_sqlite.db")
  }
})
```

### config loader

You can also utilize a custom config loader as past of the test runner extended bootstrap options.

## Logging

By default, the test runner will use a `NOOP` logger that will black hole basically all messages.
Once your test is running as expected, this cuts down on general log spam.

If you are debugging and want access to logs, that can be accomplished with the `.emitLogs()` command.

```typescript
// emits trace by default
testRunner.emitLogs();

// custom level
testRunner.emitLogs("warn");
```

## Extended Options

The full suite of options are exposed

| Type | Key | Default | Description |
| --- | --- | --- | --- |
| **Logging** | `emitLogs` | `false` | If true, default logger is left in place |
| **Logging** | `customLogger` | `NOOP` / `default` | Provide alternate logger (`createMockLogger`) |
| **Logging** | `loggerOptions` | `{}` | [Docs](/docs/core/services/builtin/logger) |
| **Lifecycle** | `bootLibrariesFirst` | `false` | Set to `true` if testing an application with that requirement |
| **Lifecycle** | `forceTeardown` | `false` | Set to `true` if your app requires running teardown hooks |
| **Configuration** | `configuration` | `{}` | passed through to `.bootstrap` call |
| **Configuration** | `loadConfigs` | `false` | Aka do not consider configuration not provided in test / module explicitly |
| **Configuration** | `configLoader` | `undefined` | Invoked during the config loading step to provide data |

> 🗒️ **Logging note:**
>
> Errors that result in application termination (like test failures) are logged directly to `console.error`.
> They always appear in the output.
