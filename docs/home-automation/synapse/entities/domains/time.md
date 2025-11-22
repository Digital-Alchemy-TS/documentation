---
title: "Time"
authors: [zoe-codez]
---

`synapse.time` creates a time entity that allows setting and displaying time values in HH:mm:ss format.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/time)

## ✏️ Usage

> minimum properties

```typescript
synapse.time({
  context,
  name: "My time entity"
});
```

> with custom time value

```typescript
synapse.time({
  context,
  name: "Alarm Time",
  native_value: "07:30:00",
  managed: true
});
```

## Entity specific attributes

> By default `time` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `native_value`

The current time value in HH:mm:ss format.

```typescript
native_value: "14:30:00"  // 2:30 PM
native_value: "09:15:30"  // 9:15 AM and 30 seconds
```

**Format**: Must be in `HH:mm:ss` format where:
- `HH` = hours (00-23)
- `mm` = minutes (00-59)
- `ss` = seconds (00-59)

#### `managed`

Controls whether the entity automatically handles incoming value change requests. Defaults to `true`.

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `set_value` / `onSetValue`

> **NOTE**: This is **not** the same thing as the `onChange` event.

```typescript
const entity = synapse.time({
  managed: false, // take full control of native_value
  set_value({ value }) {
    // process service call directly
    logger.info(`Setting time to: ${value}`);
    entity.native_value = value;
  }
});

entity.onSetValue(({ value }) => {
  // chained attaches work too
  logger.info(`Time changed to: ${value}`);
});
```

### 📝 Examples

**Simple alarm time:**
```typescript
const alarmTime = synapse.time({
  context,
  name: "Morning Alarm",
  native_value: "07:00:00",
  set_value({ value }) {
    logger.info(`Alarm time set to: ${value}`);
    // Update alarm system
    entity.native_value = value;
  }
});
```

**Work schedule time:**
```typescript
const workStartTime = synapse.time({
  context,
  name: "Work Start Time",
  native_value: "09:00:00",
  managed: true, // automatically handle changes
  set_value({ value }) {
    logger.info(`Work start time changed to: ${value}`);
    // Update work schedule
  }
});
```

**Chained event handling:**
```typescript
const sunsetTime = synapse.time({
  context,
  name: "Sunset Time",
  native_value: "18:30:00"
});

sunsetTime.onSetValue(({ value }) => {
  logger.info(`Sunset time updated to: ${value}`);
  // Update lighting schedule
});
```

**Time validation example:**
```typescript
const meetingTime = synapse.time({
  context,
  name: "Team Meeting",
  native_value: "14:00:00",
  set_value({ value }) {
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
      logger.error(`Invalid time format: ${value}`);
      return;
    }

    logger.info(`Meeting time set to: ${value}`);
    entity.native_value = value;
  }
});
```

### 💡 Use Cases

Time entities are typically used for:
- **Alarm clocks** - Setting wake-up times
- **Schedules** - Work schedules, meeting times
- **Automation triggers** - Time-based automation
- **Timers** - Countdown timers, duration settings
- **Time preferences** - User time preferences
- **System times** - System configuration times

### 🔧 Integration with Home Assistant

Time entities integrate seamlessly with Home Assistant's time system:
- Display as time pickers in the Home Assistant dashboard
- Can be controlled via automations and scripts
- Support time-based triggers and conditions
- Can be included in dashboards and cards
- Provide precise time input and display capabilities
- Format: Always uses 24-hour HH:mm:ss format

### ⏰ Time Format

All time values must be in the format `HH:mm:ss`:
- **Hours**: 00-23 (24-hour format)
- **Minutes**: 00-59
- **Seconds**: 00-59

Examples:
- `"00:00:00"` - Midnight
- `"12:00:00"` - Noon
- `"23:59:59"` - End of day
- `"09:30:15"` - 9:30 AM and 15 seconds
