---
title: Testing
sidebar_label: Overview
sidebar_position: 1
description: "Testing Digital Alchemy applications and libraries with TestRunner."
---

Digital Alchemy has first-class testing support built into the core package. The `TestRunner` constructs a minimal wrapper application around your module, runs it, and gives you access to `TServiceParams` inside your test function — no mocking frameworks required for the framework itself.

| | |
|---|---|
| [TestRunner](./test-runner.md) | Builder API: configure, run, teardown, emitLogs |
| [createModule](./create-module.md) | Extend or transform a module for testing |
| [Test Lifecycle](./test-lifecycle.md) | setup, run, teardown; working with fake timers |
| [Module Replacements](./module-replacements.md) | appendLibrary, appendService, replaceLibrary, pick/omit services |

## Quick example

```typescript
import { TestRunner } from "@digital-alchemy/core";
import { MY_APP } from "./application.mts";

describe("MyService", () => {
  it("does the thing", async () => {
    const app = await TestRunner({ target: MY_APP })
      .configure({ my_app: { FEATURE_FLAG: true } })
      .run(({ my_app }) => {
        expect(my_app.my_service.result).toBe("expected");
      });

    await app.teardown();
  });
});
```

Tests run real boot and teardown cycles. By default, logging is suppressed (`customLogger: noop`). Call `.emitLogs()` on the runner to see output while debugging.
