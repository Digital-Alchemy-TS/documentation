---
title: Automation/Utils
---
## 🌐 Overview

The utils extension provides tools for efficiently creating reference time points for doing math with.

## ⏰ refTime

`refTime` takes in a string of hour/minute/second in this format:

> `HH[:mm[:ss]]`

Time is calculated relative to midnight.

| Example | Resolved             |
| ------- | -------------------- |
| `8`     | 8AM                  |
| `08:30` | 8:30AM               |
| `15`    | 3PM                  |
| `24`    | Tomorrow at midnight |
| `48`    | etc.                 |

## 🕑 shortTime

`shortTime` is similar in concept to `refTime`, being used to calculate dates relative to midnight. The difference is how times are formatted.

> `(AM|PM)[H]H[:(00|15|30|45)]`
> `NOW`
> `TOMORROW`

| Example  | Resolved     |
| -------- | ------------ |
| `NOW`    | Current time |
| `AM8`    | 8AM          |
| `AM8:30` | 8:30AM       |
| `PM9:45` | 9:45PM       |

> [!example] #Usage-Example/automation

```typescript
function Example({ automation }: TServiceParams) {
  function isInRange() {
    const [NOW, AM830, PM3] = automation.utils.shortTime([
      "NOW",
      "AM8:30",
      "PM3",
    ]);
    return NOW.isBetween(AM830, PM3);
  }
}
```
