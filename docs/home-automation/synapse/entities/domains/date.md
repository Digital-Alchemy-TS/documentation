---
title: "Date"
authors: [zoe-codez]
---

`synapse.datetime` creates an entity that is intended to work with full iso timestamps.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/datetime/)

## ✏️ Usage

The `date` entity has the ability to present values as `dayjs`, `Date`, or `iso` (`ISO 8601`) strings, default is `iso`

> minimum properties

```typescript
synapse.date({
  context,
  name: "My date entity"
});
```

> override type

```typescript
synapse.datetime<{ date_type: "dayjs" }>({
  date_type: "dayjs", // must match
});
```

## Entity specific attributes

> By default `datetime` entities have `managed: true` set, and will automatically set values in response to service calls.

### ⚙️ Configuration

#### `date_type`

Control the format that data is presented to your code in

| Type | Format |
| --- | --- |
| iso | iso 8601 string (YYYY-MM-DD) |
| date | javascript `Date` |
| dayjs | `Dayjs` object |

#### `native_value`

`native_value` represents the current value in the requested `date_type`.
This can accept inputs in a variety of formats, but will always provide the requested format back.

For `date` & `dayjs` types, values will be provided back as start of day.

### 🌐 Events

These events are related to service calls being made against your entity.
They will occur via dashboard interactions as well as other automations running.

Entities have `managed: true` set by default, allowing them to automatically handle incoming value change requests.

#### `set_value` / `onSetValue`

> **NOTE**: This is **not** the same thing as the `onChange` event.

```typescript
const entity = synapse.date<{ date_type: "dayjs" }>({
  managed: false, // take full control of native_value
  set_value({ value }) {
    // process service call directly in with matched `date_type`
    // ??
    // write new value
    entity.native_value = value;
  }
});

entity.onSetValue(({ value }) => {
  // chained attaches work too
});
```
