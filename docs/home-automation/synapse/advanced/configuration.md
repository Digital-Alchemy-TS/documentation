---
title: Configuration
id: synapse-advanced-config
sidebar_position: 1
---

## Specialized Configuration Options

```typescript
import { HOME_AUTOMATION } from "./home-automation.module.mts";

void HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      ENTITY_CLEANUP_METHOD: "delete",
      METADATA: {
        suggested_area: "living_room",
        manufacturer: "Me",
      },
      METADATA_TITLE: "Home Automation app",
      REBUILD_ON_ENTITY_CHANGE: false,
    },
  },
});
```

### ENTITY_CLEANUP_METHOD

This configuration property controls logic on the integration side related to your application.
It gets referenced when the integration tries to align with your application on what entities are available.

Valid options: `abandon`, `delete` (default)

Affects how cleanup is performed when previously created entities are missing from the current declared setup.

- abandon: mark entity as unavailable and ignore
- delete: clean up / remove missing entities

### METADATA

Extra configuration data to use with the default device

| Property            | Description                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `configuration_url` | A URL on which the device or service can be configured, linking to paths inside the Home Assistant UI can be done by using `homeassistant://<path>`.   |
| `manufacturer`      | The manufacturer of the device, will be overridden if `manufacturer` is set. Useful for example for an integration showing all devices on the network. |
| `model`             | The model of the device, will be overridden if `model` is set. Useful for example for an integration showing all devices on the network.               |
| `name`              | Default name of this device, will be overridden if `name` is set. Useful for example for an integration showing all devices on the network.            |
| `hw_version`        | The hardware version of the device.                                                                                                                    |
| `serial_number`     | The serial number of the device. Unlike a serial number in the `identifiers` set, this does not need to be unique.                                     |
| `suggested_area`    | The suggested name for the area where the device is located. Use readable name, not area id ("Living Room" not "living_room").                         |
| `sw_version`        | The firmware version of the device.                                                                                                                    |

### METADATA_TITLE

Title for this application within the Home Assistant UI. Defaults to application name

### REBUILD_ON_ENTITY_CHANGE

> default: `false`

Add bootstrap checks for entities. If any of their attributes change then clear state in local database for that specific entity (revert to default value).
