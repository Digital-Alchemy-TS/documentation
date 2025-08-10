---
title: ⚗️ Advanced
---

## 🔄 Reactive Updates

The final method of attaching entity updates is by providing a function to automatically recalculate the value when it updates.

In the below example, the binary sensor will listen for updates from 2 other entities.
One is a native entity provided by Home Assistant, another is a synapse entity we just created.

The state of the binary sensor depends on some combination of the two states.

```typescript
const entityA = hass.refBy.id( ... );
const switchB = synapse.switch( ... );
synapse.binary_sensor({
  is_on: {
    onUpdate: [entityA, switchB],
    current() {
      return switchB.is_on ? entityA.state === "away" : false;
    }
  }
});
```

The value will recalculate every 30 seconds in addition to whenever update events happen.

### ⚠️ Avoid this

```typescript
const sensor = synapse.binary_sensor({
  context,
  icon() {
    return sensor.is_on ? "on" : "off";
  },
  name: "test",
});
```

While this appears to be valid code at first glance, and will run as expected, it is invalid Typescript.
The variable `sensor` will change it's type to `any` and cease to be useful.
Variables cannot be used in their own definitions, even indirectly.

The `self` in the reactive updates example resolves this situation.

## Reactive properties

Many entity properties are able to be defined as functions as well as hard coded defaults.

> Basic updates

```typescript
const sensor = synapse.binary_sensor({
  context,
  name: "example"
});
sensor.onUpdate(() => {
  sensor.icon = sensor.is_on ? "mdi:satellite-uplink" : "mdi:satellite-variant";
});
```

> Reactive updates

```typescript
synapse.binary_sensor({
  context,
  icon(self) {
    return self.is_on ? "on" : "off";
  },
  name: "test",
});
```


### Obtaining entity refs

You can go from `synapse` entity to `hass` entity by using the `getEntity()` API.
This value can only be determined while the application is actively running, and is not available early in your application lifecycle

```typescript
function MyService({ synapse, lifecycle }) {
  const sensor = synapse.sensor(...);

  // ❌ not this
  const ref = sensor.getEntity();

  // ✅ do this
  lifecycle.onReady(() => {
    const ref = sensor.getEntity();
    // do logic...
  });

  something.onEvent(() => {
    const ref = sensor.getEntity();
    // do logic...
  })
}
```

## 🗄️ Database Configuration

Synapse supports multiple database types through Drizzle ORM. Configure your database using environment variables or application configuration:

### Environment Variables

```bash
# Database type (sqlite, postgresql, mysql)
SYNAPSE_DATABASE_TYPE=postgresql

# Database connection URL
SYNAPSE_DATABASE_URL=postgresql://user:password@localhost:5432/synapse
```

### Application Configuration

```typescript
HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      DATABASE_TYPE: "postgresql",
      DATABASE_URL: "postgresql://user:password@localhost:5432/synapse"
    }
  },
});
```

### Database Types

| Type | Default URL | Description |
|------|-------------|-------------|
| `sqlite` | `file:./synapse_storage.db` | Local file-based storage |
| `postgresql` | Custom | Production-ready relational database |
| `mysql` | Custom | Alternative relational database |

> **Note**: For PostgreSQL and MySQL, you must provide a valid connection URL in the `DATABASE_URL` environment variable.
