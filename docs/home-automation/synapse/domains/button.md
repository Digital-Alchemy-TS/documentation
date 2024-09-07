---
title: "Button"
authors: [zoe-codez]
---

`synapse.binary_sensor` is a simple entity for reflecting a non-user-controllable binary state as an entity.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/binary-sensor)

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

- identify
- restart
- update

### 🌐 Events

#### `press` / `onPress`

```typescript
const entity = synapse.button({
  press() {
    logger.info("do the thing");
  }
});

entity.onPress(() => {
  logger.info("I was pressed!");
});
```
