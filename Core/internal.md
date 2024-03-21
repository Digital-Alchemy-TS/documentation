---
tags: []
---
## 📘 Overview

The `internal` is available on [[TServiceParams]] and provides some basic internal utilities and information by the core library.

## 🌱 Root

| Property   | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| `safeExec` | Generic function to wrap a callback with **try/catch**, and optionally keep metrics on it |
## 🛠 Utilities

> [!info] `internal.utils`
> Extra helper functions that are used internally

| Property | Description                                                          |
| -------- | -------------------------------------------------------------------- |
| `event`  | Same as the `event` reference passed in at top of [[TServiceParams]] |
## 🚀 Boot

> [!info] `internal.boot`
> Get details about the application that was booted

| Property          | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `options`         | Reference to the options passed into `.bootstrap`      |
| `application`     | Reference to the application that was bootstrapped     |
| `stage`           | Enum representing the current state of the application |
| `lifecycleEvents` | A set of all the lifecycle events that have completed  |

## 📦 Boilerplate

> [!info] `internal.boilerplate`
> Interact with the services that otherwise don't directly provide their interfaces

| Property        | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| `fetch`         | Create a new instance of [[fetch|fetcher]]                      |
| `configuration` | Interact with the [[configuration]] system, get metadata / update values |
| `logger`        | Make tweaks to the way the [[logger]] works                              |