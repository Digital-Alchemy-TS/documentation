---
title: 🦮 Helpers
---

Some optional utilities are made available to applications through additional imports from core.

## sleep

A little function that does exactly what it seems like, and a little bit more.
It will return a promise, that can be resolved at a specific timeout ms or at a `Date`.

```typescript
async function doingStuffWithAPause() {
  logger.info("step 1");
  await sleep(1000); // sleep 1 second
  logger.info("step 2");
}
```

### Cancelling

The return of the sleep is a modified promise, with a `.kill` method attached.
The kill can be set up so the sleep either never returns, or finish the sleep early.
If the sleep never returns, the async thread will be flagged by the gc to prevent memory leaks.

```typescript
let wait: ReturnType<typeof sleep>;

entity.onEvent(async () => {
  // ...
  wait = sleep(5000);
  await wait;
  wait = undefined;
});

anotherEntity.onEvent(() => {
  if (wait) {
    wait.kill("continue"); // or "stop"
  }
});
```

## is

A general purpose set of tests to test if `thingA` is `situationB`.
Contains type assertions for primitives, general purpose tests like `empty`, and
some libraries like `hass` will augment with additional tests (`is.domain(id,domain)`).

```typescript
const registry = {} as Record<SpecialThing, ComplexData>
function myLogic(message: string, data = {}) {
  console.log(message);
  // object must have keys
  if (!is.empty(data)) {
    console.log("with extra data", { data});
  }
}
```

Most useful in building helper functions and libraries
