---
tags: 
aliases:
  - Core
---
## 📘 Overview

Welcome to `@digital-alchemy/core`!

This core library is a standard utilities library used by the other TypeScript repos in the project. It is built with minimal dependencies to keep your production builds light and snappy.

The library is built as a TypeScript-first set of tools, leveraging a series of utility types and interfaces to make it easy to wire your application and see what features are available.

## 🌐 Core Library Overview

Code is organized into 3 distinct types:

### 📚 Module definitions

These are created with the `CreateLibrary` / `CreateApplication` functions and define the way that module internally relates to itself, as well as the available configurations it can consume.

For applications, the module has a `.bootstrap({ ... })` method available. Libraries are able to list other libraries as dependencies and ultimately be imported into an end application.

### 🛠 Services

Services are attached to the modules and are defined as functions that take in a parameter typed as [[TServiceParams]]. The `core` library exports its definitions to the top level, where all imported libraries must provide their definitions as a group.

> [!summary] 
> Deeper dives on `core` features

 - [[Cache|Cache]] - Basic cache adapter with support for memory and Redis drivers.
 - [[Configuration|Configuration]] - Strongly typed configurations, with a priority-based configuration loader supporting a variety of sources.
 - [[Fetch|Fetch Wrapper]] - Easily configurable wrapper for `fetch`.
 - [[Logger|Logger]] - Context-aware pretty logger, with a flexible interface.
 - [[Scheduler|Scheduler]] - Lifecycle-aware task scheduling, featuring precise timing and robust error handling.
 - [[Wiring|Wiring and Modularization]] - Defines the application's structure, ensuring clean code separation and modular development.
 - [[Internal|Internal Utilities]] - Application metadata, support, and utility functions.

### 🛠 Helpers / everything else

Primarily type definitions, constants, etc. A few come as part of the `core` library, but all the important pieces of the library come as part of the services.

## 🚀 Setting up a new project

> [!attention] 
> `@digital-alchemy` requires Node 20+

1. For Home Assistant-focused applications, see the [[Automation Quickstart Overview|automation quickstart]] project for a quick setup solution.
2. The core library comes with everything needed to wire a basic application. Starting with strict mode TypeScript, and nice linting & prettier settings from the start is recommended.

> [!missing] 
> boilerplate for `2` 

### 📦 A basic app

> [!example] #Usage-Example/core
> Below are all the required parts to start an application.

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