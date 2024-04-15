---
tags: []
---
## 📝 Description

Aggressive scenes are a service to assist [[Rooms|rooms]], and don't have a lot of use to external applications. It is best interacted with via config properties.

## ⚙️ Configuration

>
> Disable globally with [[AGGRESSIVE_SCENES]]

> [!example] #Usage-Example/automation
> Set up a room with scenes that can be set, but with the aggressive

```typescript
export function Example({ automation }: TServiceParams) {
  automation.room({
    context,
    name: "Kitchen",
    scenes: {
      high: {
        aggressive: false,
        definition: {
          "switch.bar_light": { state: "on" },
          "switch.dining_room_light": { state: "on" },
          "switch.kitchen_light": { state: "on" },
        },
        friendly_name: "High",
      },
      off: {
        aggressive: false,
        definition: {
          "switch.bar_light": { state: "off" },
          "switch.dining_room_light": { state: "off" },
          "switch.kitchen_light": { state: "off" },
        },
        friendly_name: "Off",
      },
    },
  });
}
```
