---
title: "Text"
authors: [zoe-codez]
---

`synapse.text` creates a text entity that allows setting and displaying text values with optional validation.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/text)

## ✏️ Usage

> minimum properties

```typescript
synapse.text({
  context,
  name: "My text entity"
});
```

> with validation and constraints

```typescript
synapse.text({
  context,
  name: "WiFi Password",
  mode: "password",
  native_min: 8,
  native_max: 64,
  pattern: "^[A-Za-z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$",
  native_value: "default123"
});
```

## Entity specific attributes

> By default `text` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `mode`

Defines how the text should be displayed in the UI.

| Mode | Description |
|------|-------------|
| `text` | Normal text input (default) |
| `password` | Password field (hidden input) |

#### `native_min`

The minimum number of characters in the text value (inclusive).

```typescript
native_min: 5  // minimum 5 characters
```

#### `native_max`

The maximum number of characters in the text value (inclusive).

```typescript
native_max: 100  // maximum 100 characters
```

#### `pattern`

A regex pattern that the text value must match to be valid.

```typescript
pattern: "^[A-Za-z0-9]+$"  // alphanumeric only
```

#### `native_value`

The current text value.

```typescript
native_value: "Hello World"
```

#### `managed`

Controls whether the entity automatically handles incoming value change requests. Defaults to `true`.

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `set_value` / `onSetValue`

> **NOTE**: This is **not** the same thing as the `onChange` event.

```typescript
const entity = synapse.text({
  managed: false, // take full control of native_value
  set_value({ value }) {
    // process service call directly
    logger.info(`Setting text to: ${value}`);
    entity.native_value = value;
  }
});

entity.onSetValue(({ value }) => {
  // chained attaches work too
  logger.info(`Text changed to: ${value}`);
});
```

### 📝 Examples

**Simple text input:**
```typescript
const deviceName = synapse.text({
  context,
  name: "Device Name",
  native_value: "Living Room Sensor",
  set_value({ value }) {
    logger.info(`Device name set to: ${value}`);
    // Update device name in system
    entity.native_value = value;
  }
});
```

**Password field with validation:**
```typescript
const wifiPassword = synapse.text({
  context,
  name: "WiFi Password",
  mode: "password",
  native_min: 8,
  native_max: 64,
  pattern: "^[A-Za-z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$",
  native_value: "default123",
  set_value({ value }) {
    logger.info("WiFi password updated");
    // Update WiFi password
    entity.native_value = value;
  }
});
```

**Email address with pattern validation:**
```typescript
const emailAddress = synapse.text({
  context,
  name: "Email Address",
  native_max: 254,
  pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  native_value: "user@example.com",
  set_value({ value }) {
    logger.info(`Email address set to: ${value}`);
    // Validate and update email
    entity.native_value = value;
  }
});
```

**Chained event handling:**
```typescript
const customMessage = synapse.text({
  context,
  name: "Custom Message",
  native_value: "Hello World"
});

customMessage.onSetValue(({ value }) => {
  logger.info(`Custom message changed to: ${value}`);
  // Process the new message
});
```

### 💡 Use Cases

Text entities are typically used for:
- **Configuration values** - Device names, settings, preferences
- **Password fields** - WiFi passwords, API keys, credentials
- **User input** - Custom messages, notes, descriptions
- **Form data** - Email addresses, phone numbers, addresses
- **Validation** - Input validation with regex patterns
- **Display text** - Static text that can be updated

### 🔧 Integration with Home Assistant

Text entities integrate seamlessly with Home Assistant's text system:
- Display as text input fields in the Home Assistant dashboard
- Support password mode for sensitive data
- Can be controlled via automations and scripts
- Support validation with regex patterns
- Can be included in dashboards and cards
- Provide flexible text input and display capabilities
