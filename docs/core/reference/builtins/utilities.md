---
title: Utilities
sidebar_position: 5
description: "sleep, debounce, is, each/eachSeries/eachLimit, and timing constants."
---

These utilities are exported directly from `@digital-alchemy/core` and imported at the module level. They don't appear on `TServiceParams` — import them alongside your type imports.

```typescript
import { is, sleep, each, SECOND } from "@digital-alchemy/core";
```

## sleep

```typescript
function sleep(target: TOffset | Date | Dayjs): SleepReturn
```

Async sleep. Returns a `SleepReturn` which is a `Promise<void>` with a `.kill()` method for early termination.

```typescript
await sleep("5s");          // sleep 5 seconds
await sleep("30m");         // sleep 30 minutes
await sleep(new Date(ts));  // sleep until absolute time
await sleep(dayjs().add(1, "hour"));  // sleep until dayjs target
```

### Early termination

`.kill("stop")` cancels the sleep without resolving the Promise. `.kill("continue")` cancels but resolves the Promise immediately (letting execution continue):

```typescript
const timer = sleep("30s");

// From elsewhere — cancel and continue immediately
timer.kill("continue");

await timer; // resolves immediately after kill("continue")
```

All active sleeps are tracked in `ACTIVE_SLEEPS` and killed at shutdown.

## debounce

```typescript
async function debounce(identifier: string, timeout: TOffset): Promise<void>
```

Identifier-keyed debounce. If called with the same `identifier` within `timeout`, the previous sleep is cancelled and a new one starts. The Promise resolves after the full `timeout` has elapsed without another call for the same identifier.

```typescript
// Only runs after 500ms of silence per key
async function handleInput(userId: string) {
  await debounce(`user-input:${userId}`, "500ms");
  await processInput(userId);
}
```

Calls with different identifiers are independent.

## is

The `is` singleton provides type guards and utility checks.

| Method | Description |
|---|---|
| `is.array(x)` | TypeScript type guard: `x is Array<unknown>` |
| `is.boolean(x)` | TypeScript type guard: `x is boolean` |
| `is.string(x)` | TypeScript type guard: `x is string` |
| `is.number(x)` | TypeScript type guard: `x is number` |
| `is.function(x)` | TypeScript type guard: `x is function` |
| `is.object(x)` | TypeScript type guard: `x is object` |
| `is.undefined(x)` | TypeScript type guard: `x is undefined` |
| `is.date(x)` | TypeScript type guard: `x is Date` (valid date) |
| `is.dayjs(x)` | TypeScript type guard: `x is Dayjs` (valid dayjs) |
| `is.empty(x)` | Returns `true` for empty string, array, Map, Set, object, undefined, or NaN |
| `is.equal(a, b)` | Deep equality using `isDeepStrictEqual` |
| `is.unique(arr)` | Returns the array with duplicates removed |
| `is.random(size?)` | Returns `size` (default 8) random bytes as a hex string (crypto) |

```typescript
if (is.array(value)) {
  value.forEach(...); // TypeScript knows value is array here
}

if (!is.empty(name)) {
  // name is not undefined, not empty string, etc.
}

const id = is.random(16); // 32-char hex string
```

## each

```typescript
async function each<T>(item: T[] | Set<T>, callback: (item: T) => Promise<void | unknown>): Promise<void>
```

Parallel iteration. Equivalent to `Promise.all(items.map(callback))`. Accepts arrays and Sets.

```typescript
await each(userIds, async id => {
  await processUser(id); // all run concurrently
});
```

## eachSeries

```typescript
async function eachSeries<T>(item: T[] | Set<T>, callback: (item: T) => Promise<void | unknown>): Promise<void>
```

Sequential iteration. Each callback awaits before the next starts. Accepts arrays and Sets.

```typescript
await eachSeries(items, async item => {
  await processItem(item); // runs one at a time, in order
});
```

## eachLimit

```typescript
async function eachLimit<T>(items: T[], limit: number, callback: (item: T) => Promise<void | unknown>): Promise<void>
```

Bounded concurrency. At most `limit` callbacks run simultaneously. Only accepts arrays.

```typescript
await eachLimit(urls, 5, async url => {
  await fetchAndProcess(url); // max 5 concurrent
});
```

## Timing constants

Millisecond values for common time units:

```typescript
import { SECOND, MINUTE, HOUR, DAY, WEEK } from "@digital-alchemy/core";

SECOND // 1_000
MINUTE // 60_000
HOUR   // 3_600_000
DAY    // 86_400_000
WEEK   // 604_800_000
```

```typescript
await sleep(5 * MINUTE); // sleep 5 minutes

scheduler.setInterval(() => cleanup(), 30 * SECOND);
```
