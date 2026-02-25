---
title: Execution Order
sidebar_position: 3
description: "Priority semantics, parallel vs serial execution, and late registration behavior."
---

Within each lifecycle stage, callbacks are sorted by their optional `priority` argument before execution. The framework processes them in three passes:

## Priority tiers

```
positive priorities → unprioritized → negative priorities
```

1. **Positive priorities** (`priority >= 0`): Run serially, highest first (1000 → 100 → 1 → 0)
2. **Unprioritized** (no `priority` argument): Run in **parallel** (`Promise.all`)
3. **Negative priorities** (`priority < 0`): Run serially, highest first (-1 → -10 → -1000)

This is the exact algorithm from the source:

```typescript
// positive: serial, high to low
await eachSeries(
  positive.toSorted((a, b) => (a.priority < b.priority ? UP : DOWN)),
  async ({ callback }) => await callback(),
);

// unprioritized: parallel
await each(quick, async ({ callback }) => await callback());

// negative: serial, high to low
await eachSeries(
  negative.toSorted((a, b) => (a.priority < b.priority ? UP : DOWN)),
  async ({ callback }) => await callback(),
);
```

## Implications

**Unprioritized callbacks run concurrently.** If you register three `onBootstrap` callbacks without a priority, they all start at the same time with `Promise.all`. This is usually fine and faster than serial execution.

**If ordering matters, use priority.** To guarantee that callback A runs before callback B in the same stage:

```typescript
lifecycle.onBootstrap(connectDatabase, 100);  // runs first
lifecycle.onBootstrap(warmUpCache, 50);       // runs second
lifecycle.onBootstrap(loadInitialData);       // runs concurrently with other unprioritized
```

**Negative priorities run after everything else.** Use negative priorities for optional, non-critical work that should not delay the main initialization:

```typescript
lifecycle.onBootstrap(criticalSetup, 100);
lifecycle.onBootstrap(connectToDb);          // parallel with other unprioritized
lifecycle.onBootstrap(optionalMetrics, -10); // runs last
```

## Example ordering

Given these registrations for `Bootstrap`:

```typescript
lifecycle.onBootstrap(A);          // unprioritized
lifecycle.onBootstrap(B, 50);      // positive
lifecycle.onBootstrap(C, -10);     // negative
lifecycle.onBootstrap(D, 100);     // positive
lifecycle.onBootstrap(E);          // unprioritized
```

Execution order:
1. `D` (priority 100) — serial
2. `B` (priority 50) — serial
3. `A`, `E` — parallel (Promise.all)
4. `C` (priority -10) — serial

## Late registration

A callback registered for a stage that has already completed behaves differently depending on the stage type:

**Startup stages (PreInit, PostConfig, Bootstrap, Ready):**
The callback fires immediately when registered. The stage's event list has been deleted, so the check for "has this stage run" is `!is.array(stageList)`.

```typescript
// If Bootstrap has already completed:
lifecycle.onBootstrap(() => {
  // Fires immediately, right here
  setup();
});
```

**Shutdown stages (PreShutdown, ShutdownStart, ShutdownComplete):**
The callback is silently dropped. There's no way to retroactively run cleanup.

This asymmetry exists because late-registered startup callbacks are often needed for dynamically-created sub-systems, while late-registered shutdown callbacks can't meaningfully undo work that's already being torn down.
