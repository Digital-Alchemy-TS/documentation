---
title: "Switch"
authors: [zoe-codez]
---

`synapse.switch` creates a switch entity that can be turned on and off.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/switch)

## ✏️ Usage

> minimum properties

```typescript
synapse.switch({
  context,
  name: "My switch entity"
});
```

> with device class and managed behavior

```typescript
synapse.switch({
  context,
  name: "Living Room Light",
  device_class: "outlet",
  is_on: false,
  managed: true
});
```

## Entity specific attributes

> By default `switch` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `device_class`

The type of switch device.

| Enum Value | Description |
|------------|-------------|
| `outlet` | An electrical outlet |
| `switch` | A generic switch |

#### `is_on`

The current state of the switch (on/off).

```typescript
is_on: true  // switch is on
is_on: false // switch is off
```

#### `managed`

Controls whether the entity automatically handles incoming value change requests. Defaults to `true`.

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `turn_on` / `onTurnOn`

Triggered when the switch is turned on.

```typescript
const entity = synapse.switch({
  turn_on() {
    logger.info("Switch turned on!");
    // Control actual device
    entity.is_on = true;
  }
});

entity.onTurnOn(() => {
  logger.info("Switch turned on!");
  // Additional logic
});
```

#### `turn_off` / `onTurnOff`

Triggered when the switch is turned off.

```typescript
const entity = synapse.switch({
  turn_off() {
    logger.info("Switch turned off!");
    // Control actual device
    entity.is_on = false;
  }
});

entity.onTurnOff(() => {
  logger.info("Switch turned off!");
  // Additional logic
});
```

#### `toggle` / `onToggle`

Triggered when the switch is toggled (changes state).

```typescript
const entity = synapse.switch({
  toggle() {
    logger.info("Switch toggled!");
    // Toggle actual device
    entity.is_on = !entity.is_on;
  }
});

entity.onToggle(() => {
  logger.info("Switch toggled!");
  // Additional logic
});
```

### 📝 Examples

**Simple light switch:**
```typescript
const livingRoomLight = synapse.switch({
  context,
  name: "Living Room Light",
  device_class: "switch",
  is_on: false,
  turn_on() {
    logger.info("Turning on living room light");
    // Control actual light
    entity.is_on = true;
  },
  turn_off() {
    logger.info("Turning off living room light");
    // Control actual light
    entity.is_on = false;
  }
});
```

**Outlet with managed behavior:**
```typescript
const coffeeMaker = synapse.switch({
  context,
  name: "Coffee Maker",
  device_class: "outlet",
  is_on: false,
  managed: true, // automatically handle on/off
  turn_on() {
    logger.info("Coffee maker turned on");
    // Start coffee brewing process
  },
  turn_off() {
    logger.info("Coffee maker turned off");
    // Stop coffee brewing process
  }
});
```

**Chained event handling:**
```typescript
const garageDoor = synapse.switch({
  context,
  name: "Garage Door",
  is_on: false
});

garageDoor.onTurnOn(() => {
  logger.info("Opening garage door");
  // Control garage door opener
});

garageDoor.onTurnOff(() => {
  logger.info("Closing garage door");
  // Control garage door closer
});

garageDoor.onToggle(() => {
  logger.info("Garage door state changed");
  // Update door state
});
```

### 💡 Use Cases

Switch entities are typically used for:
- **Lighting control** - Turning lights on/off
- **Appliance control** - Controlling electrical appliances
- **Power management** - Managing power to devices
- **Simple automation** - Basic on/off automation
- **Device control** - Controlling any binary device

### 🔧 Integration with Home Assistant

Switch entities integrate seamlessly with Home Assistant's switch system:
- Display as toggle switches in the Home Assistant dashboard
- Can be controlled via automations and scripts
- Support voice commands through assistants
- Can be included in dashboards and cards
- Provide simple on/off control for any device
