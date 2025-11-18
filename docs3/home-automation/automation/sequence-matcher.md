---
title: 🧾 Sequence Matcher
sidebar_position: 4
---

The sequence catcher is an advanced tool for detecting patterns of events happening within your Home Assistant setup. To explain the tool better, we'll use the use case of wanting to add functionality to a [Lutron Pico Remote](https://www.amazon.com/Lutron-3-Button-Wireless-Lighting-PJ2-3BRL-WH-L01R/dp/B00KLAXFQ0).

## 🧠 Concept

There are 5 buttons on the remote, and I want more than 5 functions available to me at any given moment as part of these buttons I have sitting around anyways. I'd like some of them to be easily discoverable and usable by guests, others to be more hidden for my own personal use.

This will be accomplished through creating button sequence patterns that can be detected, instead of using each button for a single purpose. I'm going to be using this one next to my front door in my living room, so these are the various sequences and effects I want (we'll do a couple here):

> **Important**: Multiple actions may be taken by a single sequence
> `on` -> `on` has the effect of setting current + all other rooms to `high`

| Sequence                     | Effect                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `on`                         | Set **current room** scene to `high`                                                    |
| `on` -> `on`                 | Set all **other rooms** scene to `high`                                                 |
| `off`                        | Set **current room** scene to off                                                       |
| `off` -> `off`               | Set all **other rooms** scenes to off                                                   |
| `stop` -> `stop`             | Set **current room** scene to dimmed                                                    |
| `stop` -> `stop` -> `stop`   | Set all **other rooms** to off                                                          |
| `stop` -> `high`             | Toggle `switch.guest_mode`                                                              |
| `stop` -> `lower` -> `raise` | I lost my phone, make my phone ring                                                     |
| `stop` -> `off`              | Wait 30 seconds -> Lock the doors and turn off lights -> Send confirmation notification |

## 🔍 Deeper Dive

### 🤔 What is a valid pattern?

In order to be a valid pattern, the messages need to come together as a sequence, grouped together in time. By default, the matcher uses a `1.5s` timeout between events. In order to trigger the "**I lost my phone**" flow:

1. `stop` button press
2. < `1.5s` delay
3. `lower` button press
4. < `1.5s` delay
5. `raise` button press

### 🛠 Creating a matcher

This part requires a bit of background research on your part.

> Event YAML

```yaml
event_type: lutron_caseta_button_event
data:
  serial: 60506462
  type: Pico3ButtonRaiseLower
  button_number: 3
  leap_button_number: 1
  device_name: Pico 4
  device_id: 1ed57ad2484d82d75ee052fb1a15c02b
  area_name: Master Bedroom
  button_type: stop
  action: release
```

We are going to take advantage of `action`, `button_type`, and `device_id` to build our matcher. The basic format looks like this:

> Sequence match proof of concept

```typescript
const id = "1ed57ad2484d82d75ee052fb1a15c02b";
function Example({ context, automation, logger }: TServiceParams) {
  automation.sequence({
    context,
    event_type: "lutron_caseta_button_event",
    match: ["stop", "lower", "raise"],
    filter: ({ data: { device_id, action } }) => {
      // Ensure the action is "press" and the device ID matches.
      return action === "press" && device_id === id;
    },
    exec: () => {
      logger.info("sequence triggered");
    }
  });
}
```

### 🎁 Giving it a pretty wrapper

That's a bit ugly to create bindings for. Fortunately, it's a relatively standard operation now. We can map the IDs to friendly labels, list out the buttons as types, and create a service that provides bindings for all the remotes:

> Creating a bindings file, and some example uses of it

```typescript
import { TBlackHole, TContext, TServiceParams } from "@digital-alchemy/core";

type DeviceName = keyof typeof PicoIds;

export type PicoEvent<NAME extends DeviceName> = {
  action: "press" | "release";
  area_name: string;
  button_number: number;
  button_type: "off";
  device_id: (typeof PicoIds)[NAME];
  device_name: string;
  leap_button_number: number;
  serial: number;
  type: string;
};

// Mapping of device IDs to friendly labels.
const PicoIds = {
  bed: "ef0352e07ef6a2097606920da7185060",
  living: "01836b98963c6cb045ae5a445f137aea",
  office: "48df0f0b96b842473701b002b42fe0b9",
  spare: "bd415449f84963177c877d124883535f",
} as const;

// Enum for button names used by Pico.
export enum Buttons {
  lower = "lower",
  stop = "stop",
  on = "on",
  off = "off",
  raise = "raise",
}

type PicoWatcher = {
  exec: () => TBlackHole;
  match: `${Buttons}`[];
  context: TContext;
};
type PicoBindings = Record<DeviceName, (options: PicoWatcher) => TBlackHole>;
type TEventData<NAME extends DeviceName> = {
  data: PicoEvent<NAME>;
};

export function LutronPicoBindings({
  automation,
  internal,
}: TServiceParams): PicoBindings {
  function LutronPicoSequenceMatcher<NAME extends DeviceName>(
    target_device: NAME,
  ) {
    return function ({ match, exec, context }: PicoWatcher) {
      return automation.sequence({
        context,
        event_type: "lutron_caseta_button_event",
        exec: async () => {
          await internal.safeExec(async () => await exec());
        },
        filter: ({ data: { device_id, action } }: TEventData<NAME>) => {
          // Ensure the action is "press" and the device ID matches the name
          return action === "press" && device_id === PicoIds[target_device];
        },
        label: target_device,
        match,
        // path to property to use as property to generate the match string from
        path: "data.button_type",
      });
    };
  }

  // Generate an object containing standardized callbacks for each device.
  const names = Object.keys(PicoIds) as DeviceName[];
  return Object.fromEntries(
    names.map(key => [key as DeviceName, LutronPicoSequenceMatcher(key)]),
  ) as PicoBindings;
}
```

> **Use it!**

```typescript
function Example({ context, logger, home_automation, hass}: TServiceParams) {
  // Setting scenes based on button sequences.
  home_automation.pico.living({
    context,
    match: ["on"],
    exec: () => (room.scene = "high")
  });

  // Trigger actions after a sequence and a delay.
  home_automation.pico.living({
    context,
    match: ["stop", "off"],
    exec: async () => {
      await sleep(30*1000); // Wait for 30 seconds.
      await hass.call.lock.lock({
          entity_id: [
            "lock.front_door"
          ]
    });
    await hass.call.scene.turn_on({
        entity_id: [
          "scene.living_off_off",
          "scene.living_office_off",
          "scene.living_bedroom_off",
        ]
    });
    }
  });

  // Example for a lost phone.
  home_automation.pico.living({
    context,
    match: ["stop","lower","raise"],
    exec: async () => {
      logger.info(`lost your phone in the couch again?`);
      // Trigger phone ring.
      await execa("kdeconnect-cli", ["-d", PHONE_ID, "--ring"]);
    }
  });
}
```
