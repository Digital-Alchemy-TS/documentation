---
title: 🧩 Core
id: core_index
sidebar_position: 1
description: "Hub page for core library tools"
---

[![codecov](https://codecov.io/github/Digital-Alchemy-TS/core/graph/badge.svg?token=IBGLY3RY68)](https://codecov.io/github/Digital-Alchemy-TS/core)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/core)](https://www.npmjs.com/package/@digital-alchemy/core)
[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/core)](https://github.com/Digital-Alchemy-TS/core)

The core library is a minimal dependency framework for building Typescript based applications and libraries.
It aims to provide some basic workflows and tools that can be used to create a variety of different types of projects.

## 🌐 Core Library Overview

### ⚙️ [Configuration](/docs/core/configuration)

Define and load structured configuration data from files, merge data from environment variables, and more.

### 📝 [Logger](/docs/core/logger/api)

Advanced logging interface for detailed and customizable output, compatible with external libraries for specialized logging needs.

### ⏲️ [Scheduler](/docs/core/scheduler)

Lifecycle-aware task scheduling, featuring flexible timing functions and robust error handling.

### 🔄 [Lifecycle Hooks](/docs/core/lifecycle)

Run commands at a variety of predetermined times during your application's boot or shutdown sequence.

### ⁉️ [Testing Utilities](/docs/testing/)

Convert your application into a testing module - append extra libraries and reconfigure modules to get the coverage you're looking for.

---

## 🚀 Setting up a new project

> `@digital-alchemy` requires `node20`+ (`node22` preferred)
>
> The library exports modules as `esmodules`. Your `tsconfig` & `package.json` need to be correctly set up for imports.

1. For Home Assistant-focused applications, see the [Automation Quickstart](/docs/home-automation/quickstart/haos/) project for a quick setup solution.
2. The core library comes with everything needed to wire a basic application. Starting with strict mode TypeScript, and nice linting & prettier settings from the start is recommended.

### 📦 A basic app

> Below are all the required parts to start an application.
>
> **main.ts**

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { Entry } from "./entry";

// Declare the application
export const MY_APP = CreateApplication({
  name: "my_app",
  services: { entry: Entry },
});

setImmediate(async () => await MY_APP.bootstrap());

// Add to loaded modules definitions
declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_app: typeof MY_APP;
  }
}
```

> **entry.ts**

```typescript
import { TServiceParams } from "@digital-alchemy/core";

// a service is just a function that takes in `TServiceParams`
// may return a function, or an object if it wants
export function Entry({ logger, lifecycle }: TServiceParams) {
  lifecycle.onReady(() => logger.info("hello world!"));
}
```
