---
title: ⁉️ Testing
id: testing
sidebar_position: 4
description: ""
---

The `TestRunner` follows a builder pattern that allows you to test either an application or a library.
It allows you to construct and execute a purpose built wrapper application intended to make it east to test your code.

## 🏗️ Construction

> Options can be called in any order at any time prior to `.run`

#### Basic Setup

You can create a test runner in isolation directly.

```typescript
import { TestRunner } from "@digital-alchemy/core";

const runner = TestRunner(); // minimum setup
TestRunner({ target: MY_APPLICATION });
TestRunner({ target: LIB_SPECIAL_SAUCE });
```

Or get one via the module builder

```typescript
import { createModule } from "@digital-alchemy/core";

const myModule = createModule()
  .fromApplication(MY_APPLICATION);

const runner = myModule.extend().toTest();
```

> In this minimal example, both arrive at the same runner
