## Overview

Welcome to `@digital-alchemy/core`!

This core library is a standard utilities library used by the other Typescript repos in the project. It is built with minimal dependencies in order to keep your production builds light and snappy. 

## 🌐 Core Library Overview

Code is organized into 3 types

### Project Definitions

These are created with the `CreateLibrary` / `CreateApplication` functions, and define the way that module internally relates to itself, as well as the available configurations it can consume.

For applications, the module has a `.bootstrap({ ... })` method available. Libraries are able to list other libraries as dependencies, and ultimately be imported into an end application.

### Services

- #TServiceParams

Services are attached to the project, and are defined as functions that take in a parameter typed as `TServiceParams` 

| Extension                             | Description                                                                                                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [[cache\|Cache]]                      | Basic cache adapter with support for memory and Redis drivers                                                                                                                                        |
| [[configuration\|Configuration]]      | Strongly typed configurations, with priority based configuration loader supporting a variety of sources                                                                                              |
| [[fetch\|Fetch Wrapper]]              | Easily configurable wrapper for `fetch`                                                                                                                                                              |
| [[logger\|Logger]]                    | Context aware pretty logger, with flexible interface                                                                                                                                                 |
| [[scheduler\|Scheduler]]              | Lifecycle-aware task scheduling, featuring precise timing and robust error handling.                                                                                                                 |
| [[wiring\|Wiring and Modularization]] | Defines the application's structure, ensuring clean code separation and modular development.<br><br>Comprehensive support for managing the application's lifecycle, from initialization to shutdown. |
| [[internal\|Internal Utilities]]      | Application metadata, support, and utility functions                                                                                                                                                 |
### Everything Else

Primarily type definitions, constants, etc. 
## Setting a new project

> [!attention] `@digital-alchemy` requires node20+


### A basic app

### Services

## Closer look at wiring

