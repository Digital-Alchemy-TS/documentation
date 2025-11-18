---
title: "Lock"
authors: [zoe-codez]
---

`synapse.lock` is a wrapper around the Home Assistant lock entity, allowing you to build your own virtual lock for a variety of uses

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/lock)

## ✏️ Usage

> minimum properties

```typescript
synapse.binary_sensor({
  context,
  name: "My binary sensor entity"
});
```

## Entity specific attributes

> By default `lock` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

| Name           | Type    | Description                                                      |
|----------------|---------|------------------------------------------------------------------|
| `changed_by`   | string  | Describes what the last change was triggered by.                 |
| `code_format`  | string  | Regex for code format or None if no code is required.            |
| `is_locked`    | boolean | Indication of whether the lock is currently locked.              |
| `is_locking`   | boolean | Indication of whether the lock is currently locking.             |
| `is_unlocking` | boolean | Indication of whether the lock is currently unlocking.           |
| `is_jammed`    | boolean | Indication of whether the lock is currently jammed.              |
| `is_opening`   | boolean | Indication of whether the lock is currently opening.             |
| `is_open`      | boolean | Indication of whether the lock is currently open.                |

### 🌐 Events

- `lock` / `onLock`
- `unlock` / `onUnlock`
- `open` / `onOpen`
