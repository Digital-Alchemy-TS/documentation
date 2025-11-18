---
title: 🗒️ Logger
sidebar_position: 5
---

The test runner provides a code path to testing calls made to the logger by overriding the logger used internally.

```typescript
it("tests", async () => {
  const loggerSpy = createMockLogger()
  await testRunner.setOptions({
    customLogger: loggerSpy
  }).run(...)

  expect(loggerSpy.error).not.toHaveBeenCalledWith("🐔 the sky is falling!");
})
```
