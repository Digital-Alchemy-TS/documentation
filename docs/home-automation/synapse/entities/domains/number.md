---
title: "Number"
authors: [zoe-codez]
---

`synapse.number` creates an entity that allows setting and controlling numeric values with optional constraints.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/number)

## ✏️ Usage

> minimum properties

```typescript
synapse.number({
  context,
  name: "My number entity"
});
```

> with constraints

```typescript
synapse.number({
  context,
  name: "Temperature Setting",
  native_min_value: 0,
  native_max_value: 100,
  step: 0.5,
  native_value: 20
});
```

## Entity specific attributes

> By default `number` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `mode`

Defines how the number should be displayed in the UI.

| Mode | Description |
|------|-------------|
| `auto` | Automatically choose the best display mode (default) |
| `slider` | Force slider display mode |
| `box` | Force input box display mode |

#### `native_min_value`

The minimum accepted value in the number's native unit of measurement (inclusive).

#### `native_max_value`

The maximum accepted value in the number's native unit of measurement (inclusive).

#### `step`

Defines the resolution of the values, i.e. the smallest increment or decrement.

#### `native_value`

The current value of the number in the number's native unit of measurement.

#### Device Class Properties

Number entities also support all standard sensor properties including:
- `device_class` - Type of measurement (temperature, humidity, etc.)
- `unit_of_measurement` - Unit for the value
- `suggested_display_precision` - Suggested number of decimal places
- `suggested_unit_of_measurement` - Suggested unit for display

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `set_value` / `onSetValue`

> **NOTE**: This is **not** the same thing as the `onChange` event.

```typescript
const entity = synapse.number({
  managed: false, // take full control of native_value
  set_value({ value }) {
    // process service call directly
    logger.info(`Setting value to ${value}`);
    entity.native_value = value;
  }
});

entity.onSetValue(({ value }) => {
  // chained attaches work too
  logger.info(`Value changed to ${value}`);
});
```

### 📝 Examples

**Temperature control:**
```typescript
const thermostat = synapse.number({
  context,
  name: "Thermostat Setting",
  device_class: "temperature",
  unit_of_measurement: "°C",
  native_min_value: 10,
  native_max_value: 30,
  step: 0.5,
  native_value: 22,
  mode: "slider",
  set_value({ value }) {
    logger.info(`Setting thermostat to ${value}°C`);
    // Control actual thermostat
    entity.native_value = value;
  }
});
```

**Volume control:**
```typescript
const volumeControl = synapse.number({
  context,
  name: "Speaker Volume",
  device_class: "volume",
  unit_of_measurement: "%",
  native_min_value: 0,
  native_max_value: 100,
  step: 1,
  native_value: 50,
  mode: "slider",
  set_value({ value }) {
    logger.info(`Setting volume to ${value}%`);
    // Control actual speaker volume
    entity.native_value = value;
  }
});
```

**Brightness control:**
```typescript
const brightness = synapse.number({
  context,
  name: "Light Brightness",
  device_class: "illuminance",
  unit_of_measurement: "%",
  native_min_value: 0,
  native_max_value: 100,
  step: 5,
  native_value: 75,
  mode: "box",
  set_value({ value }) {
    logger.info(`Setting brightness to ${value}%`);
    // Control actual light brightness
    entity.native_value = value;
  }
});
```
