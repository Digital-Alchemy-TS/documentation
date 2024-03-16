## 📘 Overview

- #TServiceParams/internal
- #TServiceParams

The `internal` property is some basic internal utilities and information provided by the core library.

## Root

| Property   | Description                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `safeExec` | Generic function to wrap a callback with **try/catch**, and optionally keep metrics on it<br>#Feature/core/Metrics |

## Utilities

> [!info] `internal.utils`
> Extra helper functions that are used internally

| Property | Description                   |
| -------- | ----------------------------- |
| `event`  | Same as #TServiceParams/event |
## Boot

> [!info] `internal.boot`
> Get details about the application that was booted

| Property          | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `options`         | Reference to the options passed into `.bootstrap`      |
| `application`     | Reference to application that was bootstrapped         |
| `stage`           | Enum representing the current state of the application |
| `lifecycleEvents` | A set of all the lifecycle events that have completed  |
## Boilerplate

> [!info] `internal.boilerplate`
> Interact with the services that otherwise don't directly provide their interfaces

| Property | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `fetch`  | Creates a new instance of [[01 Core/fetch\|fetcher]]                     |
| `config` | Interact with the [[configuration]] system, get metadata / update values |
| `logger` | Make tweaks to the way the [[logger]] works                              |
| `cache`  | Extra reference to [[cache]]                                             |
