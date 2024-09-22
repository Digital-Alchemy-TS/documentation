---
title: 🧩 Core
id: core_index
sidebar_position: 1
description: "Hub page for core library tools"
---
Welcome to `@digital-alchemy/core`!

The core library provides the basic utilities required to define services and wire them together into higher level modules.
These utilities are not built for any predefined use case, and are suitable for large & complex applications, quick scripts, web servers, home automation, and more.

Easy type safety is at built into the framework from the start, using a combination of declaration merging and utility types to build a standard import for your code.

## 🌐 Core Library Overview

Code is organized into 3 distinct types:

### 📚 Module definitions

These are created with the `CreateLibrary` / `CreateApplication` functions and define the way that module internally relates to itself, as well as the available configurations it can consume.

Modules are populated with services and configuration definitions. They can be then combined with each other and bootstrapped to form a running application.

### ⁉️ Tests

Testing is important and `@digital-alchemy` helps you to do that.
The core library exports a series of utilities for [rebuilding modules](/docs/core/modules) and [testing](/docs/testing/) them to ensure your logic continues to operate as expected.


### 📩 Helpers & utilities

Primarily type definitions, constants, etc. A few come as part of the `core` library, but all the important pieces of the library come as part of the services.

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
