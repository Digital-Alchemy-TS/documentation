---
title: "⚙️ Configuration"
authors: [zoe-codez]
sidebar_position: 4
---

## 📜 Description

This documentation provides a comprehensive overview of all configuration options available in the Synapse library. Configuration variables can be set through environment variables, CLI switches, or configuration files in `ini`, `yaml`, and `json` formats.

## 🗃️ Device Metadata

By default, the app will provide these values for the device metadata:

- `sw_version`: synapse library version number
- `manufacturer`: "Digital Alchemy"
- `name`: (your declared application name)

### 📝 Metadata Table

| Field               | Type     | Description                                                                                             |
|---------------------|----------|---------------------------------------------------------------------------------------------------------|
| `configuration_url` | `string` | A URL on which the device or service can be configured, linking to paths inside the Home Assistant UI   |
| `manufacturer`      | `string` | The manufacturer of the device, will be overridden if `manufacturer` is set.                             |
| `model`             | `string` | The model of the device, will be overridden if `model` is set.                                           |
| `name`              | `string` | Default name of this device, will be overridden if `name` is set.                                        |
| `hw_version`        | `string` | The hardware version of the device.                                                                     |
| `serial_number`     | `string` | The serial number of the device. Unlike a serial number in the `identifiers` set, this does not need to be unique. |
| `suggested_area`    | `string` | The suggested name for the area where the device is located. Use readable name, not area id ("Living Room" not "living_room") |
| `sw_version`        | `string` | The firmware version of the device.                                                                     |

## 🔧 Configuration Table

| Variable             | Type      | Default Value          | Description                                                                                           |
|----------------------|-----------|------------------------|-------------------------------------------------------------------------------------------------------|
| `EMIT_HEARTBEAT`     | `boolean` | `true`                 | Emit a heartbeat pulse so the extension knows the service is alive                                    |
| `EVENT_NAMESPACE`    | `string`  | `"digital_alchemy"`    | You almost definitely do not want to change this. Must be matched on the python integration side.     |
| `HEARTBEAT_INTERVAL` | `number`  | `5`                    | Seconds between heartbeats                                                                            |
| `METADATA_HOST`      | `string`  | (none)                 | Host name to announce as                                                                              |
| `METADATA_TITLE`     | `string`  | (none)                 | Title for the integration provided by this app. Defaults to app name                                  |
| `METADATA_UNIQUE_ID` | `string`  | (none)                 | A string to uniquely identify this application. Should be unique within home assistant, such as a uuid. Default value calculated from hostname + username + app_name |
| `PUBLISH_BONJOUR`    | `boolean` | `true`                 | Publish mDNS discovery topics to allow zeroconf discovery                                             |

## 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script

```bash
export EMIT_HEARTBEAT=false
tsx src/main.ts
```

> Set up as an environment variable for just the single run

```bash
EVENT_NAMESPACE="magic_world" tsx src/main.ts
```

> Use a `.env` file to set multiple variables

```bash
# .env file
EMIT_HEARTBEAT=false
EVENT_NAMESPACE="quantum_realm"
HEARTBEAT_INTERVAL=20
```

```bash
# --env-file provided by runtime will load extra vars
tsx --env-file .env src/main.ts
```

### 🎛️ CLI Switch

> Provide your config as a switch

```bash
tsx src/main.ts --heartbeat_interval 10
```

### 📁 File

> If your file does not have an extension, [Configuration](/docs/core/configuration) will do auto

#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  EMIT_HEARTBEAT=false
  EVENT_NAMESPACE=quantum_realm
  HEARTBEAT_INTERVAL=20
  METADATA_HOST=server.local
  METADATA_TITLE=Super_App
  METADATA_UNIQUE_ID=unique-1234
  PUBLISH_BONJOUR=false
```

#### 📄 yaml

> `.my_app_name.yaml`

```yaml
synapse:
  EMIT_HEARTBEAT: false
  EVENT_NAMESPACE: "quantum_realm"
  HEARTBEAT_INTERVAL: 20
  METADATA_HOST: "server.local"
  METADATA_TITLE: "Super App"
  METADATA_UNIQUE_ID: "unique-1234"
  PUBLISH_BONJOUR: false
```

### 🗃️ json

> `.my_app_name.json`

```json
{
  "synapse": {
    "EMIT_HEARTBEAT": false,
    "EVENT_NAMESPACE": "quantum_realm",
    "HEARTBEAT_INTERVAL": 20,
    "METADATA_HOST": "server.local",
    "METADATA_TITLE": "Super App",
    "METADATA_UNIQUE_ID": "unique-1234",
    "PUBLISH_BONJOUR": false
  }
}
```

## 🔧 Example Metadata

```typescript
const deviceMetadata: HassDeviceMetadata = {
  configuration_url: "homeassistant://integrations/synapse",
  manufacturer: "Magic Widgets Co.",
  model: "Alpha 3000",
  name: "Synapse Device",
  hw_version: "1.0",
  serial_number: "SN1234567890",
  suggested_area: "Control Center",
  sw_version: "2.1.4"
}
```
