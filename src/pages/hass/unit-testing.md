---
title: Hass/Unit Testing
---
## Overview

So, you have your application successfully connecting to Home Assistant and issuing commands to start forming the basis of a new automation system.
Now it's time to start adding tests to your code, ensuring that it continues to do what it is supposed to do even when you are trying out new ideas in the future.

This guide exists to provide a basic workflow for setting up unit testing with your automation project, how to mock out Home Assistant, and a few example tests to give a practical demonstration.
We will be seeking to test the application in isolation today, causing logic to run but preventing the application from communicating with Home Assistant

> **Note**: You will need a working understanding of unit testing, why it exists, how to use the tools, etc.
>
> I will be using [Jest](https://jestjs.io/) here, but the general process applies to other testing frameworks as well

## Initial Setup

To get started, you should have a working application that has at least one service. Our goals today are:

- take that existing application
- import it into a testing environment
- provide mock values for all areas / entities / labels / etc
- observe what the application does, and when

### Dependencies

Aside from the test runner itself, no new dependencies are actually needed! `@digital-alchemy/hass` comes with a testing tool named **Mock Assistant** hidden away right out of the box (v0.3.22 and higher)

### Mock Assistant

Mock Assistant is used for creating testing fixtures, as well as implementing those inside of an existing application. It has 2 major components:

1. script to generate a test fixtures file
2. importable library to load data from fixtures file, and inject that data into the application

Mock Assistant will also throw errors if you do not have the `MOCK_SOCKET` configuration set.
This flag tells the websocket api that it should not attempt to connect to Home Assistant, even if it has valid credentials for some reason.

### Setting up fixtures

The fixtures file can be configured by a configuration file on a per-test basis. By default, tests will load `/fixtures.json` from the repository root.
This file contains all areas, entity information, labels, etc related to your instance.

The information exists to provide a starting point in tests, announcing that various data elements exist and how they are wired together.
It's a lot of information, and easiest to just use a script to take a snapshot of a running install.
Values can be altered as part of the setup for a test (covered below), so putting a lot of effort into tuning this file isn't needed.
This can be accomplished by using the provided `mock-assistant` script

```bash
npx mock-assistant
# or
node node_modules/@digital-alchemy/hass/dist/mock_assistant/main.js
```

## Building tests

For some context on what's coming next, this is a basic test wrapper

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { LIB_MOCK_ASSISTANT } from "@digital-alchemy/hass/mock-assistant";
import { MY_APP } from "./main";

describe("Example Tests", () => {
  afterEach(async () => {
    // tear down the app at the end of the test to reset
    await MY_APP.teardown();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("tests things", async () => {
    // declare the quantity of assertions to be make
    expect.assertions(1);

    // start your app with a couple of alterations:
    // 1. an extra library will be injected to make alterations
    // 2. extra service(s) will be added to facilitate running the test
    // 3. MOCK_SOCKET flag set, with most log messages squelched
    await MY_APP.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: {
        Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
          // set initial state
          mock_assistant.fixtures.setState({
            "sensor.location": {
              state: "away",
            },
          });
          lifecycle.onReady(async () => {
            // add spies
            const turnOn = jest.spyOn(hass.call.switch, "turn_on");

            // do some stuff
            await mock_assistant.events.emitEntityUpdate("sensor.location", {
              state: "home",
            });
            // ....???

            // test
            expect(turnOn).toHaveBeenCalledTimes(1);
          });
        },
      },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true },
      },
    });
  });
});
```

Going forward, only the contents of the `it` block will be provided for the tests

### Event / Response

One of the most common patterns for automations is issuing a command in response to an event.
Sometimes checking on another variable, entity state, or it's immediate previous state to gate logic.

```typescript
export function LocationServices({ hass }: TServiceParams) {
  const location = hass.entity.byId("sensor.location");
  const leak_sensor = hass.entity.byId("binary_sensor.water_heater_leak_sensor");

  leak_sensor.onUpdate((new_state) => {
    // don't do things if there isn't water
    if (new_state.state === "off") {
      return;
    }
    // if I am at home, change the scene to catch attention
    if (location.state === "home") {
      await hass.call.scene.turn_on({
        entity_id: "scene.office_error"
      });
    }
    // send a notification either way
    await hass.call.notify.notify({
      message: "Detected a water leak at the water heater",
      title: "Water leak detected!",
    });
  });
}
```

In this service, we're responding to events from 2 sensors, and calling various services based on some internal logic.
Here is an example of a test to check the

```typescript
expect.assertions(2);

await MY_APP.bootstrap({
  appendLibrary: LIB_MOCK_ASSISTANT,
  appendService: {
    Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
      // set initial state
      mock_assistant.fixtures.setState({
        "sensor.location": { state: "away" },
        "binary_sensor.water_heater_leak_sensor": { state: "off" },
      });
      lifecycle.onReady(async () => {
        // watch both methods
        const turnOn = jest.spyOn(hass.call.scene, "turn_on");
        const notify = jest.spyOn(hass.call.notify, "notify");
        // emit update
        await mock_assistant.events.emitEntityUpdate(
          "binary_sensor.water_heater_leak_sensor",
          { state: "on" },
        );
        // observe result
        expect(notify).toHaveBeenCalled();
        expect(turnOn).not.toHaveBeenCalled();
      });
    },
  },
  configuration: {
    boilerplate: { LOG_LEVEL: "error" },
    hass: { MOCK_SOCKET: true },
  },
});
```

### Timers

A slightly more complicated example. If the system detects smoke, and it's between 5AM & 8PM, then wake up everyone

```typescript
export function TimersExample({ hass, scheduler, automation }: TServiceParams) {
  const location = hass.entity.byId("sensor.location");
  scheduler.cron({
    async exec() {
      await hass.call.switch.turn_on({
        entity_id: "switch.porch_light",
      });
    },
    schedule: CronExpression.EVERY_DAY_AT_8PM,
  });

  hass.entity.byId("binary_sensor.smoke_detector").onUpdate((new_state) => {
    // limit to while at home
    if (new_state.state === "off" || location.state !== "home") {
      return;
    }
    // check to see if it's between 5AM & 8PM
    // outside that window, things should be
    const [NOW, PM8, AM5] = automation.utils.shortTime(["NOW", "PM8", "AM5"]);
    if (!NOW.isBetween(AM5, PM8)) {
      return;
    }
    await wakeUpSeriously()
  })

  async function wakeUpSeriously() {
    await hass.call.scene.turn_on({ entity_id: ["scene.bedroom_high"] })
    // ... whatever actions are needed for alerting to fire in the house
  }
}
```

There's a few things going on here. Let's break it down real quick

1. There is a scheduled function that performs the same action at the same time every day
2. There is an event listener, which cares about my current location and the time of day in order to gate logic

In order to properly test the service, it will need several tests to test various workflows at different points of time.
Obviously, we can't only run unit tests at night, or whenever the actions are supposed to run at.
Instead, we need to mock the timers within NodeJS, manually setting the time and manually changing the time when we need it

```typescript
jest.useFakeTimers();
expect.assertions(1);

await MY_APP.bootstrap({
  appendLibrary: LIB_MOCK_ASSISTANT,
  appendService: {
    Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
      // set initial state
      mock_assistant.fixtures.setState({
        "sensor.location": { state: "home" },
        "binary_sensor.smoke_detector": { state: "off" },
      });
      // set to 10PM
      jest.setSystemTime(new Date("2024-01-01 22:00:00"));
      lifecycle.onReady(async () => {
        // set up watcher
        const turnOn = jest.spyOn(hass.call.scene, "turn_on");
        // emit update
        await mock_assistant.events.emitEntityUpdate(
          "binary_sensor.smoke_detector",
          { state: "on" },
        );
        // observe result
        expect(notify).toHaveBeenCalledWith({ entity_id: ["scene.bedroom_high"] });
      });
      // run the application through onReady
      jest.runOnlyPendingTimersAsync();
    },
  },
  configuration: {
    boilerplate: { LOG_LEVEL: "error" },
    hass: { MOCK_SOCKET: true },
  },
});
```

Tests to verify the service call does **NOT** occur are easy to wire up at a variety of other times, as well as if the location is set differently
We'll need a slightly different strategy to test the cron schedule though

```typescript
jest.useFakeTimers();
expect.assertions(1);

await MY_APP.bootstrap({
  appendLibrary: LIB_MOCK_ASSISTANT,
  appendService: {
    Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
      // set to 7:59:59PM (1 second before event)
      jest.setSystemTime(new Date("2024-01-01 19:59:59"));
      lifecycle.onReady(async () => {
        // set up watcher
        const turnOn = jest.spyOn(hass.call.switch, "turn_on");
        // move clock forward by 2 seconds
        jest.advanceTimersByTime(2000);
        // observe result
        expect(notify).toHaveBeenCalledWith({ entity_id: ["switch.porch_light"] });
      });
      // run the application through onReady
      jest.runOnlyPendingTimersAsync();
    },
  },
  configuration: {
    boilerplate: { LOG_LEVEL: "error" },
    hass: { MOCK_SOCKET: true },
  },
});
```
