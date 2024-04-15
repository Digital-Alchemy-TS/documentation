---
tags: []
---
## 📖 Description

The REST API is a basic configurable [[Fetch]] wrapper, tuned for some useful REST API endpoints in Home Assistant.

## 🛠 Methods

> [!check] APIs available [onBootstrap](/core/lifecycle/onBootstrap)
> **Consumes configs:** [[Home Automation/Hass/config/BASE_URL|BASE_URL]], [[Home Automation/Hass/config/TOKEN|TOKEN]]

| Exported Function Name      | Description                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `calendarSearch`            | Searches for calendar events within a specified date range and returns them sorted by start date.  |
| `callService`               | Calls a Home Assistant service with the specified parameters and returns the entity state changes. |
| `checkConfig`               | Checks the Home Assistant configuration for errors and returns the result.                         |
| `checkCredentials`          | Verifies if the current credentials are valid.                                                     |
| `download`                  | Downloads files from the Home Assistant server with specified fetch arguments.                     |
| `fetchEntityCustomizations` | Fetches entity customizations, either global or local, for specified entity IDs.                   |
| `fetchEntityHistory`        | Retrieves the history of an entity within a specified time frame and returns it.                   |
| `fireEvent`                 | Fires a custom event in Home Assistant with optional data.                                         |
| `getAllEntities`            | Fetches the current state of all entities in Home Assistant.                                       |
| `getHassConfig`             | Retrieves the current Home Assistant configuration.                                                |
| `getLogs`                   | Fetches the Home Assistant server logs and adjusts the timestamps.                                 |
| `getRawLogs`                | Retrieves the raw Home Assistant server logs as a string.                                          |
| `listServices`              | Lists all available services in Home Assistant.                                                    |
| `updateEntity`              | Updates the state and/or attributes of a specified entity.                                         |
| `webhook`                   | Sends a request to a specified webhook in Home Assistant with optional data.                       |
