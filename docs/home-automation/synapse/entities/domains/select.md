---
title: "Select"
authors: [zoe-codez]
---

`synapse.select` creates a select entity that allows choosing from a predefined list of options.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/select)

## ✏️ Usage

> minimum properties (options is required)

```typescript
synapse.select({
  context,
  name: "My select entity",
  options: ["option1", "option2", "option3"]
});
```

> with current option and managed behavior

```typescript
synapse.select({
  context,
  name: "Mode Selector",
  options: ["auto", "manual", "eco"],
  current_option: "auto",
  managed: true
});
```

## Entity specific attributes

> By default `select` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `options`

**Required.** A list of available options as strings. This defines what values can be selected.

```typescript
options: ["low", "medium", "high"]
```

#### `current_option`

The currently selected option from the available options list.

```typescript
current_option: "medium"
```

#### `managed`

Controls whether the entity automatically handles incoming value change requests. Defaults to `true`.

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `select_option` / `onSelectOption`

> **NOTE**: This is **not** the same thing as the `onChange` event.

```typescript
const entity = synapse.select({
  managed: false, // take full control of current_option
  select_option({ option }) {
    // process service call directly
    logger.info(`Selecting option: ${option}`);
    entity.current_option = option;
  }
});

entity.onSelectOption(({ option }) => {
  // chained attaches work too
  logger.info(`Option selected: ${option}`);
});
```

### 📝 Examples

**Simple mode selector:**
```typescript
const fanMode = synapse.select({
  context,
  name: "Fan Mode",
  options: ["off", "low", "medium", "high"],
  current_option: "off",
  select_option({ option }) {
    logger.info(`Setting fan mode to: ${option}`);
    // Control actual fan
    entity.current_option = option;
  }
});
```

**Temperature unit selector:**
```typescript
const tempUnit = synapse.select({
  context,
  name: "Temperature Unit",
  options: ["celsius", "fahrenheit"],
  current_option: "celsius",
  managed: true, // automatically handle changes
  select_option({ option }) {
    logger.info(`Temperature unit changed to: ${option}`);
    // Update display units throughout the system
  }
});
```

**Generic type-safe selector:**
```typescript
type LightMode = "warm" | "cool" | "daylight" | "night";

const lightMode = synapse.select<LightMode>({
  context,
  name: "Light Mode",
  options: ["warm", "cool", "daylight", "night"],
  current_option: "warm",
  select_option({ option }) {
    logger.info(`Light mode set to: ${option}`);
    // Control actual lights
    entity.current_option = option;
  }
});
```

**Chained event handling:**
```typescript
const powerMode = synapse.select({
  context,
  name: "Power Mode",
  options: ["eco", "normal", "performance"],
  current_option: "normal"
});

powerMode.onSelectOption(({ option }) => {
  logger.info(`Power mode changed to: ${option}`);
  // Adjust system power settings
});
```

### 💡 Use Cases

Select entities are typically used for:
- **Mode selection** - Fan speeds, power modes, operation modes
- **Unit selection** - Temperature units, measurement units
- **Preset selection** - Lighting presets, audio presets
- **State selection** - System states, configuration options
- **Menu systems** - Dropdown-style selections in the UI

### 🔧 Integration with Home Assistant

Select entities integrate seamlessly with Home Assistant's select system:
- Display as dropdown menus in the Home Assistant dashboard
- Can be controlled via automations and scripts
- Support voice commands through assistants
- Can be included in dashboards and cards
- Provide a clean UI for choosing from predefined options
