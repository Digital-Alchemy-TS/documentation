---
title: 🗂️ Internal
---

The `internal` is available on `TServiceParams` and provides some basic internal utilities and information by the core library.

## 🌱 Root

| Property   | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| `safeExec` | Generic function to wrap a callback with **try/catch**, and optionally keep metrics on it |

## 🚀 Boot

> **Property**: `internal.boot`
>
> Get details about the application that was booted

| Property          | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `options`         | Reference to the options passed into `.bootstrap`      |
| `application`     | Reference to the application that was bootstrapped     |
| `stage`           | Enum representing the current state of the application |
| `lifecycleEvents` | A set of all the lifecycle events that have completed  |

## 📦 Boilerplate

> **Property**: `internal.boilerplate`
>
> Interact with the services that otherwise don't directly provide their interfaces

| Property        | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| `configuration` | Interact with the [configuration](/docs/core/configuration) system, get metadata / update values |
| `logger`        | Make tweaks to the way the [logger](/docs/core/logger) works                              |
