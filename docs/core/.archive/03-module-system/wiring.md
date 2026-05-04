---
title: Wiring
sidebar_position: 6
description: "How modules and services are wired, dependency ordering, and boot errors."
---

"Wiring" refers to the process of calling each service function and assembling the `TServiceParams` it receives. This happens during bootstrap, before any lifecycle callbacks run.

## Dependency ordering

Libraries are wired in topological order determined by their `depends` arrays. Given:

```
MY_APP
  libraries: [LIB_A, LIB_B]

LIB_B
  depends: [LIB_A]
```

The wire order is: `boilerplate` → `LIB_A` → `LIB_B` → `MY_APP`. `LIB_A` is always wired before `LIB_B` because `LIB_B` depends on it.

```mermaid
graph LR
    BP[boilerplate] --> A[LIB_A]
    A --> B[LIB_B]
    B --> APP[MY_APP]
```

## Circular dependencies

Circular dependencies are **not allowed and not recoverable**. If `LIB_A` depends on `LIB_B` and `LIB_B` depends on `LIB_A`, bootstrap throws:

```
BootstrapException: Cannot find a next lib to load
  cause: BAD_SORT
```

The fix is to extract the shared logic into a third library that both can depend on without forming a cycle.

## Missing dependencies

If a library declares `depends: [LIB_X]` but the application's `libraries` array does not include `LIB_X`, bootstrap throws:

```
BootstrapException
  cause: MISSING_DEPENDENCY
```

Add `LIB_X` (or an equivalent replacement) to your application's `libraries` array.

## Service wiring order within a module

Services within a module are wired in the order they appear in the `services` object, with `priorityInit` services wired first. See [Services — priorityInit](./services.md#priorityinit) for details and examples.

## loadedModules

After bootstrap completes, `internal.boot.loadedModules` is a `Map<string, Record<string, unknown>>` mapping module names to their wired service return values. `internal.boot.moduleMappings` maps module names to service constructor functions. These are primarily useful for debugging and framework-level tooling — application code should use `TServiceParams` directly.
