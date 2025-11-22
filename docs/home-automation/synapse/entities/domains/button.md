---
title: "Button"
authors: [zoe-codez]
---

`synapse.button` creates a simple entity that can be pressed to trigger actions.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/button)

## ✏️ Usage

> minimum properties

```typescript
synapse.button({
  context,
  name: "My button entity"
});
```

## Entity specific attributes

### ⚙️ Configuration

#### `device_class`

| Enum Value | Description |
|------------|-------------|
| `identify` | Button to identify the device |
| `restart`  | Button to restart the device |
| `update`   | Button to update the device |

### 🌐 Events

#### `press` / `onPress`

Buttons emit a `press` event when activated. This can be handled in two ways:

**Inline handler:**
```typescript
const entity = synapse.button({
  context,
  name: "My button",
  press() {
    logger.info("Button was pressed!");
    // Handle the press action
  }
});
```

**Chained handler:**
```typescript
const entity = synapse.button({
  context,
  name: "My button"
});

entity.onPress(() => {
  logger.info("Button was pressed!");
  // Handle the press action
});
```

### 📝 Examples

**Simple button with action:**
```typescript
const restartButton = synapse.button({
  context,
  name: "Restart System",
  device_class: "restart",
  press() {
    logger.info("Restarting system...");
    // Perform restart logic
  }
});
```

**Button with custom attributes:**
```typescript
const identifyButton = synapse.button({
  context,
  name: "Identify Device",
  device_class: "identify",
  attributes: {
    manufacturer: "My Company",
    model: "Button-001"
  },
  press() {
    logger.info("Device identification triggered");
    // Flash LED or other identification action
  }
});
```
