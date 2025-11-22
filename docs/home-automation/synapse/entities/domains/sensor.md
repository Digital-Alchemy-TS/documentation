---
title: "Sensor"
authors: [zoe-codez]
---

`synapse.sensor` creates sensor entities for various measurements and states. The state type is determined by the `device_class` property.

> [Home Assistant Counterpart](https://developers.home-assistant.io/docs/core/entity/sensor)

## ✏️ Usage

> minimum properties

```typescript
synapse.sensor({
  context,
  name: "My sensor entity"
});
```

> with device class and state

```typescript
synapse.sensor({
  context,
  name: "Living Room Temperature",
  device_class: "temperature",
  unit_of_measurement: "°C",
  state: 22.5
});
```

> enum sensor with options

```typescript
synapse.sensor({
  context,
  name: "System Status",
  device_class: "enum",
  options: ["online", "offline", "maintenance"],
  state: "online"
});
```

## Entity specific attributes

### ⚙️ Configuration

#### `device_class`

The type of sensor device. This determines the state type and available properties.

| Device Class | State Type | Description | Example Values |
|--------------|------------|-------------|----------------|
| `temperature` | number | Temperature measurements | `22.5`, `-5.2` |
| `humidity` | number | Humidity percentage | `45.2`, `100.0` |
| `pressure` | number | Atmospheric pressure | `1013.25`, `980.5` |
| `illuminance` | number | Light level | `500`, `1200` |
| `battery` | number | Battery percentage | `85`, `100` |
| `power` | number | Power consumption | `120.5`, `0.0` |
| `energy` | number | Energy consumption | `1234.56`, `0.0` |
| `voltage` | number | Electrical voltage | `230.0`, `12.5` |
| `current` | number | Electrical current | `5.2`, `0.0` |
| `frequency` | number | Frequency measurements | `50.0`, `60.0` |
| `gas` | number | Gas concentration | `450`, `0` |
| `moisture` | number | Moisture level | `35.2`, `100.0` |
| `co2` | number | CO2 concentration | `800`, `400` |
| `pm25` | number | PM2.5 concentration | `12.5`, `0.0` |
| `enum` | string | Enumeration values | `"online"`, `"offline"` |
| `date` | date | Date values | `"2024-01-15"` |
| `timestamp` | date | Timestamp values | `"2024-01-15T10:30:00Z"` |

#### `state`

The current state value. The type depends on the `device_class`.

```typescript
// Numeric state (for most device classes)
state: 22.5

// String state (for enum device class)
state: "online"

// Date state (for date/timestamp device classes)
state: "2024-01-15"
```

#### `unit_of_measurement`

The unit for the measurement value.

```typescript
unit_of_measurement: "°C"      // temperature
unit_of_measurement: "%"       // humidity, battery
unit_of_measurement: "hPa"     // pressure
unit_of_measurement: "lx"      // illuminance
unit_of_measurement: "W"       // power
unit_of_measurement: "kWh"     // energy
unit_of_measurement: "V"       // voltage
unit_of_measurement: "A"       // current
unit_of_measurement: "Hz"      // frequency
unit_of_measurement: "ppm"     // gas, co2
unit_of_measurement: "μg/m³"   // pm25
```

#### `options`

For `enum` device class sensors, defines the valid state values.

```typescript
options: ["online", "offline", "maintenance"]
```

#### Additional Properties

Depending on the device class, additional properties may be available:

- `suggested_display_precision` - Suggested number of decimal places
- `suggested_unit_of_measurement` - Suggested unit for display
- `last_reset` - Last reset timestamp (for cumulative sensors)
- `state_class` - State classification (measurement, total, etc.)

### 📝 Examples

**Temperature sensor:**
```typescript
const temperature = synapse.sensor({
  context,
  name: "Living Room Temperature",
  device_class: "temperature",
  unit_of_measurement: "°C",
  state: 22.5,
  suggested_display_precision: 1
});
```

**Humidity sensor:**
```typescript
const humidity = synapse.sensor({
  context,
  name: "Bathroom Humidity",
  device_class: "humidity",
  unit_of_measurement: "%",
  state: 65.2
});
```

**Power consumption sensor:**
```typescript
const power = synapse.sensor({
  context,
  name: "Living Room Power",
  device_class: "power",
  unit_of_measurement: "W",
  state: 120.5,
  state_class: "measurement"
});
```

**Enum sensor with options:**
```typescript
const systemStatus = synapse.sensor({
  context,
  name: "System Status",
  device_class: "enum",
  options: ["online", "offline", "maintenance", "error"],
  state: "online"
});
```

**Battery sensor:**
```typescript
const battery = synapse.sensor({
  context,
  name: "Motion Sensor Battery",
  device_class: "battery",
  unit_of_measurement: "%",
  state: 85
});
```

**Date sensor:**
```typescript
const lastUpdate = synapse.sensor({
  context,
  name: "Last Update",
  device_class: "date",
  state: "2024-01-15"
});
```

### 💡 Use Cases

Sensor entities are typically used for:
- **Environmental monitoring** - Temperature, humidity, pressure, air quality
- **Energy monitoring** - Power consumption, energy usage, voltage, current
- **Device status** - Battery levels, system status, connection state
- **Measurement data** - Any numeric or categorical measurement
- **Time tracking** - Dates, timestamps, durations
- **Status indicators** - Enum values for system states

### 🔧 Integration with Home Assistant

Sensor entities integrate seamlessly with Home Assistant's sensor system:
- Display with appropriate units and formatting
- Support for graphs and historical data
- Can be used in automations and scripts
- Support for device classes with specific UI handling
- Can be included in dashboards and cards
- Provide flexible measurement and status capabilities

### 📊 State Type Determination

The state type is automatically determined by the `device_class`:

- **Numeric sensors**: Most device classes (temperature, humidity, power, etc.)
- **String sensors**: `enum` device class
- **Date sensors**: `date` and `timestamp` device classes

This ensures proper type safety and UI rendering in Home Assistant.
