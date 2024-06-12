---
slug: basic-automation
title: Building a basic Automation
authors: [zoe-codez]
---

> This guide is part of a series. Check out the previous steps here
>
> 1. Check out the [quickstart](/docs/home-automation/quickstart/automation-quickstart/) guide to create your own project

Now that we have a foundation on **what is a service** / **how to wire them together**, let's build on that by creating a basic automation.

## 🌐 Connecting to Home Assistant

For this, we'll need to import the [hass](/docs/home-automation/hass/) library. If you used the [quickstart](/docs/home-automation/quickstart/automation-quickstart/) project, this should already be set up for you.

```typescript
import { CreateApplication } from "@digital-alchemy/core";
// Import library definition
import { LIB_HASS } from "@digital-alchemy/hass";

const SUPER_AWESOME_APP = CreateApplication({
  // add to libraries
  libraries: [LIB_HASS],
  name: "my_super_awesome_app",
  // ...
});
```

> 🎉
> **What changed:**
>
> - your application will connect to home assistant during bootstrap

## 🤖 Creating logic

### 🌋 Responding to events

It's finally time to the application do something productive! Let's start out with taking a look a super basic automation to get a feel for the grammar.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function BasicAutomation({ hass, logger }: TServiceParams) {
  const mySensor = hass.entity.byId("binary_sensor.my_example_sensor");

  mySensor.onUpdate(async (new_state, old_state) => {
    logger.info(
      `my_example_sensor updated ${old_state.state} => ${new_state.state}`,
    );
    await hass.call.switch.toggle({
      entity_id: "switch.example_switch",
    });
  });
}
```

In this example, an entity reference was created, with an update listener attached to it. The provided `new_state` & `old_state` variables reflect the states for that particular update, and while `mySensor` can be also used to directly access current state.

Now for more complex example, setting up a temporary schedule while a condition is true.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

// 5 MINUTES
const REPEAT_NOTIFICATION_INTERVAL = 1000 * 60 * 5;

export function GaragePester({ scheduler, logger, hass, internal }: TServiceParams) {
  const isHome = hass.entity.byId("binary_sensor.i_am_home");
  const garageIsOpen = hass.entity.byId("binary_sensor.garage_is_open");
  let stop: () => void;

  // UPDATE TRIGGER
  isHome.onUpdate((new_state, old_state) => {
    if (new_state.state === "off") {
      // am home, stop notifying and clean up
      if (stop) {
        logger.info("welcome back home!");
        stop();
        stop = undefined;
      }
      return;
    }
    if (old_state.state !== "off" || stop) {
      return;
    }

    // send a notification every 5 minutes
    // ex: "You left 20m ago with the garage open"
    const notifyingSince = new Date();
    stop = scheduler.interval({
      async exec() {
        logger.info("still a problem");
        // calculate a friendly string that describes how long
        const timeAgo = internal.utils.relativeDate(notifyingSince);

        // call the `notify.notify` service
        await hass.call.notify.notify({
          message: `You left ${timeAgo} with the garage open`,
          title: "Come back and close the garage!",
        });
      },
      interval: REPEAT_NOTIFICATION_INTERVAL,
    });
  });

  garageIsOpen.onUpdate(() => {
    // stop notifying if I remotely close the garage
    if (garageIsOpen.state === "off" && stop) {
      logger.info("stopping garage reminders");
      stop();
      stop = undefined;
    }
  });
}
```

In this example, the service will track a pair of `binary_sensor` entities. If the combination indicates that I am both away, and the garage door is left open, then it will set up a temporary schedule.

If the situation changes, then the timer is stopped 🎉

### ⏰ Timers

Timers don't need to just be set in response to events, they can be a central feature of the way your application works. Send morning reports, make events that happen at "2ish"

```typescript
import { CronExpression, sleep, TServiceParams } from "@digital-alchemy/core";

export function WeatherReport({ scheduler, logger, hass }: TServiceParams) {
  const forecast = hass.entity.byId("weather.forecast_home");

  async function SendWeatherReport() {
    const [today] = forecast.attributes.forecast;
    const unit = forecast.attributes.temperature_unit;
    const message = [
      `Today's weather will be ${today.condition}`,
      `High: ${today.temperature}${unit} | Low: ${today.templow}${unit}`,
      `Precipitation: ${today.precipitation * 100}%`,
      // Hopefully with a perfect afternoon
    ].join("\n");
    logger.info({ message }, "sending weather report");
    await hass.call.notify.notify({
      message,
      title: `Today's weather report`,
    });
  }

  scheduler.cron({
    async exec() {
      await SendWeatherReport();
    },
    schedule: CronExpression.EVERY_DAY_AT_8AM,
  });

  scheduler.cron({
    async exec() {
      // Generate random number 0-30
      const waitMins = Math.floor(Math.random() * 30);
      logger.debug(`sleeping ${waitMins} minutes`);
      await sleep(waitMins * 1000 * 60); // 😴

      logger.info("doing the thing!");
      // maybe turn off if you need some rain? 🌧
      await hass.call.switch.turn_on({
        entity_id: "switch.perfect_weather_machine",
      });
    },
    schedule: CronExpression.EVERY_DAY_AT_2PM,
  });
}
```

> See [Scheduler](/docs/core/scheduler) for more specific documentation.

## 🎬 Bringing it all together

Time to bring it all together back in your application definition. If it isn't added there, it won't run!

```typescript
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";

const SUPER_AWESOME_APP = CreateApplication({
  libraries: [LIB_HASS],
  name: "my_super_awesome_app",
  services: {
    BasicAutomation,
    GaragePester,
    WeatherReport,
  }
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    my_super_awesome_app: typeof SUPER_AWESOME_APP;
  }
}

setImmediate(
  async () =>
    await SUPER_AWESOME_APP.bootstrap(),
);
```

That's it! Run your code and enjoy your new super awesome app 😉

---
- #Blog
