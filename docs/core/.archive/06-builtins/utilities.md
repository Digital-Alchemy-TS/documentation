---
title: Utilities
sidebar_position: 5
description: "Built-in utility functions and type guards available in Digital Alchemy Core."
---

Digital Alchemy exports several utility functions and constants that are used throughout the framework and useful in application code.

## is — type guards

`is` is an instance of `IsIt`, a collection of type guard methods. Import it directly or access it via `internal.utils.is`.

```typescript
import { is } from "@digital-alchemy/core";

is.string(value)    // value is string
is.number(value)    // value is number (NaN returns false)
is.boolean(value)   // value is boolean
is.array(value)     // value is Array<unknown>
is.object(value)    // value is object (not null, not array)
is.function(value)  // value is function
is.undefined(value) // value is undefined
is.symbol(value)    // value is symbol
is.date(value)      // value is valid Date
is.dayjs(value)     // value is valid Dayjs instance

is.empty(value)     // true for empty string, array, Map, Set, object, or undefined
is.equal(a, b)      // deep equality (uses Node's isDeepStrictEqual)
is.even(n)          // n % 2 === 0
is.unique(array)    // returns [...new Set(array)]
is.random(array)    // returns a random element
```

`is.empty` works across types:
```typescript
is.empty(undefined)      // true
is.empty("")             // true
is.empty([])             // true
is.empty(new Map())      // true
is.empty({})             // true
is.empty("hello")        // false
is.empty([1, 2])         // false
```

## sleep

Awaitable, cancellable sleep. See [Scheduler — sleep](./scheduler.md#sleep) for full docs.

```typescript
import { sleep } from "@digital-alchemy/core";

await sleep(1000);      // 1 second
await sleep("30s");
await sleep([5, "minute"]);
```

## debounce

Wait for a quiet period before proceeding. Extends the wait if called again within the window.

```typescript
import { debounce } from "@digital-alchemy/core";

async function onChange() {
  await debounce("state-update", 500); // wait 500ms of quiet
  processChanges();
}
```

The first argument is an identifier string — multiple callers with the same identifier share the debounce window. A new call before the window expires resets the timer.

## Time constants

Millisecond constants for readable durations:

```typescript
import { SECOND, MINUTE, HOUR, DAY, WEEK, YEAR } from "@digital-alchemy/core";

SECOND  // 1_000
MINUTE  // 60_000
HOUR    // 3_600_000
DAY     // 86_400_000
WEEK    // 604_800_000
YEAR    // 31_536_000_000
```

Example:

```typescript
schedule.setTimeout(doThing, 5 * MINUTE);
const isStale = Date.now() - lastSeen > 2 * HOUR;
```

## each / eachSeries / eachLimit

Async iteration utilities:

```typescript
import { each, eachSeries, eachLimit } from "@digital-alchemy/core";

// Parallel (Promise.all)
await each(items, async item => { await process(item); });

// Sequential
await eachSeries(items, async item => { await process(item); });

// Concurrency-limited
await eachLimit(items, 5, async item => { await process(item); });
```

## relativeDate

Human-readable relative time:

```typescript
internal.utils.relativeDate("2024-01-01T00:00:00Z");
// "1 yr. ago"

internal.utils.relativeDate(Date.now() - 30_000);
// "30 sec. ago"
```
