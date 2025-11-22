---
title: "Scene"
authors: [zoe-codez]
---

`synapse.scene` creates a scene entity that can be activated to trigger predefined actions or states.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/scene)

## ✏️ Usage

> minimum properties

```typescript
synapse.scene({
  context,
  name: "My scene entity"
});
```

## Entity specific attributes

Scene entities are simple and have no configurable properties. They exist primarily to be activated.

### 🌐 Events

#### `activate` / `onActivate`

Scenes emit an `activate` event when triggered. This can be handled in two ways:

**Inline handler:**
```typescript
const entity = synapse.scene({
  context,
  name: "My scene",
  activate() {
    logger.info("Scene activated!");
    // Perform scene actions
  }
});
```

**Chained handler:**
```typescript
const entity = synapse.scene({
  context,
  name: "My scene"
});

entity.onActivate(() => {
  logger.info("Scene activated!");
  // Perform scene actions
});
```

### 📝 Examples

**Simple scene:**
```typescript
const movieMode = synapse.scene({
  context,
  name: "Movie Mode",
  activate() {
    logger.info("Activating movie mode...");
    // Dim lights, close blinds, start projector, etc.
  }
});
```

**Scene with custom attributes:**
```typescript
const goodnightScene = synapse.scene({
  context,
  name: "Goodnight",
  attributes: {
    icon: "mdi:bed",
    friendly_name: "Goodnight Scene"
  },
  activate() {
    logger.info("Activating goodnight scene...");
    // Turn off lights, lock doors, arm security, etc.
  }
});
```

**Scene with chained event handling:**
```typescript
const partyMode = synapse.scene({
  context,
  name: "Party Mode"
});

partyMode.onActivate(() => {
  logger.info("Party mode activated!");
  // Turn on party lights, start music, etc.
});
```

### 💡 Use Cases

Scenes are typically used for:
- **Home automation sequences** - "Movie mode", "Goodnight", "Away mode"
- **Multi-device control** - Activating multiple devices with a single action
- **State management** - Setting up predefined configurations
- **Automation triggers** - Providing a simple way to trigger complex sequences

### 🔧 Integration with Home Assistant

Scene entities integrate seamlessly with Home Assistant's scene system:
- Can be triggered from the Home Assistant dashboard
- Can be included in automations and scripts
- Can be controlled via the Home Assistant API
- Support voice commands through assistants like Google Home or Alexa
