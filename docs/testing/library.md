---
title: 📂 Libraries
sidebar_position: 2
---

Testing libraries is the most straightforward way to use the test runner.

### Minimal Example

```typescript
import { TestRunner } from "@digital-alchemy/core/testing";

describe("Example Tests", () => {
  it("is a basic example", async () => {
    expect.assertions(1);

    await TestRunner().run(({ logger }) => {

    });
  })
});
```
