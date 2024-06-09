---
title: Unit Testing
---
## Overview

So, you have some automations built and are looking to make sure future changes don't break your code.
Or maybe you heard about test driven development and wanted to apply it to your automations.
Whatever your goals are, Digital Alchemy can help you build the tests to make sure your code does what you say it should.

This guide exists to provide a basic workflow for setting up unit testing with your automation project, how to mock out Home Assistant, and a few example tests to give a practical demonstration.
We will be seeking to test the application in isolation today, causing logic to run but preventing the application from communicating with Home Assistant.

> **Note**: I will be using [Jest](https://jestjs.io/) here, but the general process applies to other testing frameworks as well.
>
> You should have a working understanding of how to create services with Digital Alchemy, and a working understanding of unit testing to get the most out of this guide.

## Initial Setup

To get started, you should already have an application.
Fortunately, some example code exists [here](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample).

> All code in the repo is functional! Run the setup script to try it out on your machine.

### Landmarks

- [package.json](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/package.json)
  - contains jest configurations
- [reference Home Assistant install](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/tree/main/hass)
  - contains a docker based Home Assistant install, set up with the entities used in code
  - [application](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/tree/main/src/mocks) used to configure entities
- [main.ts](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/main.ts) does not contain [application definition](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/application.ts)
- [application logic](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/tree/main/src/logic)
- [tests folder](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/tree/main/src/tests)

You can explore the code in the repo, but as a light overview of the logic being performed:

1. Scheduled actions turning on the porch light at night ([src](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/logic/scheduled-actions.ts#L7))
2. A routine to turn on the lights if the smoke detector goes off at night ([src](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/logic/safety.ts#L20))

## Test Fixtures

> Fixtures in unit testing are pre-defined states or conditions that serve as a baseline for executing tests.
> They encompass a set of objects or data that are instantiated before running specific test cases, ensuring a consistent environment for testing.
> Fixtures help in setting up the initial conditions necessary for the tests to be conducted accurately and reliably, ultimately enhancing the repeatability and reliability of unit tests.

The companion project [Mock Assistant](/hass/mock-assistant) has been provided as part of the `hass` library.
It's role is to generate testing fixures for your application, and inject them into the application to assist the testing process.

## Building tests

Every setup is a little different.
If you are importing libraries such as MQTT into your application, you will need to take additional steps to mock that as well.

For more minimal applications, only utilizing the `hass` related libraries, a minimal test runner wrapper is provided as part of the Mock Assistant.

```typescript
import { CreateTestRunner } from "@digital-alchemy/hass/mock-assistant";
import { UNIT_TESTING_APP } from "../application";

describe("Example",() => {
  const runner = CreateTestRunner(UNIT_TESTING_APP);

  afterEach(async () => {
    await UNIT_TESTING_APP.teardown();
    // ...
  });

  it("tests something", () => {
    await runner(
      ({ mock_assistant, ... }) => {
        // set initial state
      },
      async ({ mock_assistant, hass, ... }) => {
        // execute test
      },
    );
  })
})
```

### Event / Response

One of the most common patterns for automations is issuing a command in response to an event.
Sometimes checking on another variable, entity state, or it's immediate previous state to gate logic.
It's super simple to build tests for these situations as well!

Here is a quick function that sends a notification when a leak is detected:

```typescript
hass.entity.byId("binary_sensor.water_heater_leak_sensor").onUpdate((new_state) => {
  if (new_state.state === "on") {
    // 😱 oh no!
    await hass.call.notify.notify({ message: "Water heater leak detected!" });
  }
});
```

In order to test it, all that is needed to make the application see a state change of `off` to `on`, and verify that a notification was sent as a result

```typescript
await runner(
  // ** SETUP
  ({ mock_assistant, ... }) => {
    // start with sensor off
    mock_assistant.fixtures.setState({
      "binary_sensor.water_heater_leak_sensor": { state: "off" },
    });
  },
  // ** EXECUTE
  async ({ mock_assistant, hass, ... }) => {
    // set up spy to watch for action
    const notify = jest.spyOn(hass.call.notify, "notify");
    // emit state change
    await mock_assistant.events.emitEntityUpdate(
      "binary_sensor.water_heater_leak_sensor",
      { state: "on" },
    );
    // verify method was called
    expect(notify).toHaveBeenCalled();
  },
);
```

Easy!

### Working with time

Sometimes you want different actions to happen depending on the time of day.
It would be terrible waiting to run tests until it's a specific time to run the test.
The [smoke detector](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/logic/safety.ts) logic from earlier implements this type of logic, as well as a secondary check against a sensor state.

Fortunately, Jest (and others) provide tools for manipulating time during tests. [Jest timer mocks](https://jestjs.io/docs/timer-mocks)

```typescript
// in setup block
jest.setSystemTime(new Date("..."));
```

We can combine that with the existing techniques for manipulating states to build a series of tests for every combination of time & state.
The tests file does this with a simple for loop: [code](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/tests/safety.spec.ts#L33)

![unit tests passing](/img/unit-tests-passing.png)

### Scheduled Actions

For some situations, relying on entity updates to cause service calls isn't ideal.
Using time itself as a trigger is needed, or there may be delays built into your logic that need to be accounted for in the test.

> Testing what happens across a specific 2 seconds in time

```typescript
// in setup block
jest.setSystemTime(new Date("..."));
// in testing block
jest.advanceTimersByTime(2000);
```

- [Implementation in test](https://github.com/Digital-Alchemy-TS/hass-unit-testing-sample/blob/main/src/tests/scheduled-actions.spec.ts#L23)

---

In summary, Digital Alchemy offers a comprehensive solution for implementing unit testing in automation projects. By following the outlined workflow, you can effectively set up tests, mock dependencies, and maintain a stable testing environment. Utilize Jest and other supported frameworks to confidently verify your automations, ensuring reliability and code quality. Embrace unit testing with Digital Alchemy to streamline development and prevent regressions.

Start testing now and elevate your automation journey!
