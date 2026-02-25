---
title: Module Replacements
sidebar_position: 2
description: "appendLibrary, appendService, replaceLibrary — injecting test doubles."
---

`TestRunner`'s fluent API provides three methods for injecting test doubles and extending the module configuration.

## appendLibrary

Add a library to the test run that wasn't in the original app's `libraries` array. Useful for injecting test-specific libraries (mock transports, fake data sources).

```typescript
await TestRunner(MY_APP)
  .appendLibrary(MOCK_EMAIL_LIB)
  .run(async ({ my_app, mock_email }) => {
    await my_app.orders.placeOrder({ userId: "123" });
    expect(mock_email.sent).toHaveLength(1);
  });
```

The appended library is wired in dependency order. If it has `depends`, those must also be present.

## appendService

Inject an extra service directly into the application for the test run. The service is wired as if it were declared in the app. By default, the function's `.name` property is used as the service key.

```typescript
await TestRunner(MY_APP)
  .appendService(function captureEvents({ event }: TServiceParams) {
    const captured: unknown[] = [];
    event.on("user:created", e => captured.push(e));
    return { captured };
  })
  .run(async ({ my_app, captureEvents }) => {
    await my_app.users.create({ name: "Alice" });
    expect(captureEvents.captured).toHaveLength(1);
  });
```

Pass a name explicitly if the function is anonymous or you want a different key:

```typescript
runner.appendService(fn, "testCapture");
```

## replaceLibrary

Substitute one library for another by name. The replacement library must have the same `name`. Used for swapping a real library for a mock implementation.

```typescript
const MOCK_DB_LIB = CreateLibrary({
  name: "database",  // ← must match the original library's name
  services: {
    connection: MockConnectionService,
    query:      MockQueryService,
  },
});

await TestRunner(MY_APP)
  .replaceLibrary("database", MOCK_DB_LIB)
  .run(async ({ my_app }) => {
    // my_app.database.connection is now MockConnectionService's return value
    const result = await my_app.api.getUsers();
    expect(result).toEqual(MOCK_USERS);
  });
```

The replacement completely substitutes the original library. The original library's services are not wired.

## Combining replacements

All three methods can be combined:

```typescript
await TestRunner(MY_APP)
  .replaceLibrary("database", MOCK_DB_LIB)
  .appendLibrary(TEST_FIXTURES_LIB)
  .appendService(CaptureService, "capture")
  .configure({ my_app: { DEBUG: true } })
  .run(async ({ my_app, capture }) => {
    // ...
  });
```

## Creating a reusable mock library

For frequently mocked libraries, create a shared mock module:

```typescript title="test/mocks/database.mts"
import { CreateLibrary } from "@digital-alchemy/core";

export const MOCK_DATABASE = CreateLibrary({
  name: "database",
  services: {
    connection: MockConnection,
    query:      MockQuery,
  },
});
```

```typescript title="test/my-service.test.mts"
import { MOCK_DATABASE } from "./mocks/database.mts";

await TestRunner(MY_APP)
  .replaceLibrary("database", MOCK_DATABASE)
  .run(async ({ my_app }) => { /* ... */ });
```
