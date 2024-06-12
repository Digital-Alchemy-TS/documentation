---
title: 🕟 Time
sidebar_position: 2
---
The `automation.time` extension provides tools for quickly performing automation calculations involving time.

## ShortTime syntax

Valid values:

- "`NOW`"
- "`TOMORROW`"
- Pattern: `(AM|PM)[H]H[:(00|15|30|45)]`

Examples: `AM8`, `AM09`, `PM5:30`

## Creating References

```typescript
const [AM8, PM5, NOW] = automation.time.refTime(["AM8", "PM5", "NOW"]);
```

## Time tests

- `isBefore(time: TShortTime)`
- `isAfter(time: TShortTime)`
- `isBetween(start: TShortTime, end: TShortTime)`

```typescript
function shouldDoThing() {
  if (automation.time.isAfter("AM10:30")) {
    return false;
  }
  return automation.time.isBefore("PM5");
}
```
