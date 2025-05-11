---
title: Utilities
---

## Overview

`@digital-alchemy/core` exposes a few utilities out outside the main `TServiceParams` wrapper.
These are intended for convenience, and

## sleep

A `setTimeout` that can be `await`ed, with a few tricks up it's sleeve. Basic usage:

```typescript
async function myLogic() {
  // some logic
  await sleep(1000);
  // more logic
}
```

You may provide ms timeout, or `Date` to wait until a target time.
The sleep itself may be interacted with by other logic, providing a `kill` method that that allows different outcomes:

- `stop`: stop the sleep and discard promise (garbage collect)
- `continue`: stop the sleep and return immediately

```typescript
entity.onEvent(() => {
  if (!timer) {
    return;
  }
  timer.kill("stop");
  timer = undefined;

})
let timer: SleepReturn;
async function myLogic() {
  // some logic
  timer?.kill("stop"); // stop previous
  timer = sleep(1000 * 60 * 60 * 24); // create new
  await timer;
  logger.thing("timer was not cancelled after 24h");
  timer = undefined;
}
```
## throttle & debounce

The `throttle` & `debounce` are similar methods that can be used to help logic not run too often.

- `throttle`: allow the first call, then block for a duration before allowing next
- `debounce`: wait for duration before allowing, additional calls inside that window remove previous

```typescript
myEntity.onEvent(() => {
  await debounce("my_special_debounce", 250);
  logger.info("debounced!");
})
```

## is

The `is` object is a grab bag of canned type assertions and quick transformations.
It aims to provide a common grammar for the various assertions made across the framework that is type safe.

| Method | Library | Notes |
| --- | --- | --- |
| `is.array` | core | Wrapper for `Array.isArray` |
| `is.boolean` | core | `typeof` wrapper |
| `is.context` | core | assertion tool for internals |
| `is.date` | core | type check |
| `is.empty` | core | returns `true` for things that have content (non-empty strings, objects with keys, etc) |
| `is.equal` | core | Deep equality test |
| `is.even` | core |  |
| `is.function` | core | `typeof` wrapper |
| `is.number` | core | `typeof` wrapper |
| `is.object` | core | `typeof` wrapper, false for arrays and null |
| `is.random` | core | selects a random item out of provided array |
| `is.string` | core | `typeof` wrapper |
| `is.symbol` | core | `typeof` wrapper |
| `is.undefined` | core | `typeof` wrapper |
| `is.unique` | core | takes array of things, removes duplicates using `Set` |
| `is.domain` | hass | check if an entity belongs to a domain |
