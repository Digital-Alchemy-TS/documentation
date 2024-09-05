---
title: "💼 Locals"
authors: [zoe-codez]
sidebar_position: 4
---

Synapse entity locals are intended as a generic data cache that can be associated with a specific entity.
Updates to locals do not go out to Home Assistant, and do not emit any entity update events.

You have the ability to provide defaults, with current value being tracked in sqlite for easy restoration between instances of your app.

## 🪇 Example usage

```typescript
const exampleSensor = synapse.sensor({
  // ...
  locals: { lastUpdate: Date.now() },
});

async function runSomeLogic() {
  const ranRecently = dayjs().subtract(30, 'second').isAfter(exampleSensor.locals.lastUpdate);
  if (ranRecently) {
    // don't do anything
    return;
  }
  // do some logic logic
  exampleSensor.locals.lastUpdate = Date.now();
}
```

## ⚙️ Defaults interactions

Locals will source their value from data provided at runtime first, falling back to hard coded defaults.


```typescript
type SensorLocals = {
  lastUpdate: number;
  operation?: string
}
const sensor = synapse.sensor<SensorStateType, SensorLocals>({
  locals: { lastUpdate: Date.now() },
});
// current state
sensor.locals.lastUpdate === time at boot
sensor.locals.operation === undefined;

// updates as expected
sensor.locals.lastUpdate = Date.now()
sensor.locals.operation = "getting weird";

delete sensor.locals.lastUpdate; // returns to time at boot
delete sensor.locals.operation; // returns to undefined
```

## 🎹 Language operators

Locals attempt to act naturally with normal language operators, working with sqlite to match values as appropriate.

### has

```typescript
if ("operation" in sensor.locals) {
  // ✅ gates as expected
}
```

### ownKeys

```typescript
const allLocals = Object.keys(sensor.locals); // ✅
```

### set

In addition to operating against single properties, the locals can also be assigned to as an entire block.
On the inside, the system will remove & set properties as appropriate to match the incoming data.

```typescript
sensor.locals = { lastUpdate: Date.now(), operation: "example" };
```

### delete

The delete operator can be used to clear data from locals (and remove from sqlite).
You can use this with both single properties, and against the locals as a whole.

```typescript
delete sensor.locals; // remove all locals data & reset to defaults
```
