---
title: "⚙️ Configuration"
authors: [zoe-codez]
sidebar_position: 4
---
## 📜 Description

This documentation provides a comprehensive overview of all configuration options available in the Hass library. Configuration variables can be set through environment variables, CLI switches, or configuration files in `ini`, `yaml`, and `json` formats.

## 🔧 Configuration Table

| Variable                      | Type      | Default Value                     | Description                                                                                           |
|-------------------------------|-----------|-----------------------------------|-------------------------------------------------------------------------------------------------------|
| `AUTO_CONNECT_SOCKET`         | `boolean` | `true`                            | Websocket must be manually initialized if set to false                                                |
| `AUTO_SCAN_CALL_PROXY`        | `boolean` | `true`                            | Should the call proxy request a service listing at bootstrap?                                         |
| `BASE_URL`                    | `string`  | `http://homeassistant.local:8123` | URL to reach Home Assistant at                                                                        |
| `EXPECT_RESPONSE_AFTER`       | `number`  | `5`                               | If `sendMessage` was set to expect a response, a warning will be emitted after this delay if one is not received |
| `MANAGE_REGISTRY`             | `boolean` | `true`                            | Live track registry data                                                                               |
| `MOCK_SOCKET`                 | `boolean` | `false`                           | Operate with an artificial socket connection. For unit testing                                        |
| `RETRY_INTERVAL`              | `number`  | `5`                               | How often to retry connecting on connection failure (seconds)                                         |
| `SOCKET_AVG_DURATION`         | `number`  | `5`                               | How many seconds worth of requests to use in average for math in REQ_PER_SEC calculations             |
| `SOCKET_CRASH_REQUESTS_PER_SEC`| `number` | `500`                             | Socket service will commit sudoku if more than this many outgoing messages are sent to Home Assistant in a second. Usually indicates runaway code. |
| `SOCKET_WARN_REQUESTS_PER_SEC` | `number` | `300`                             | Emit warnings if the home controller attempts to send more than X messages to Home Assistant inside of a second. |
| `TOKEN`                       | `string`  | (none)                           | Long-lived access token to Home Assistant. Required.                                                  |
| `TRACK_ENTITIES`              | `boolean` | `true`                            | Set to false to not fetch entity info at boot, and maintain states                                    |
| `VALIDATE_CONFIGURATION`      | `boolean` | `false`                           | Validate the credentials, then quit                                                                   |
| `WEBSOCKET_URL`               | `string`  | (none)                           | Override calculated value if it's breaking or you want something custom. Make sure to use "ws[s]://" scheme. |

## 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export AUTO_CONNECT_SOCKET=false
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
BASE_URL="http://custom.homeassistant.local:8123" tsx src/main.ts
```
> Use a `.env` file to set multiple variables
```bash
# .env file
AUTO_CONNECT_SOCKET=false
AUTO_SCAN_CALL_PROXY=true
BASE_URL="http://custom.homeassistant.local:8123"
EXPECT_RESPONSE_AFTER=10
MANAGE_REGISTRY=false
MOCK_SOCKET=true
RETRY_INTERVAL=10
SOCKET_AVG_DURATION=10
SOCKET_CRASH_REQUESTS_PER_SEC=1000
SOCKET_WARN_REQUESTS_PER_SEC=600
TOKEN="your_long_lived_access_token"
TRACK_ENTITIES=false
VALIDATE_CONFIGURATION=true
WEBSOCKET_URL="wss://custom.websocket.url"
```
```bash
# Use the --env-file switch to provide the .env file
tsx src/main.ts --env-file .env
```

### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --retry_interval 15
```

### 📁 File

> If your file does not have an extension, [Configuration](/docs/core/configuration) will do auto

#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  AUTO_CONNECT_SOCKET=false
  AUTO_SCAN_CALL_PROXY=true
  BASE_URL=http://custom.homeassistant.local:8123
  EXPECT_RESPONSE_AFTER=10
  MANAGE_REGISTRY=false
  MOCK_SOCKET=true
  RETRY_INTERVAL=10
  SOCKET_AVG_DURATION=10
  SOCKET_CRASH_REQUESTS_PER_SEC=1000
  SOCKET_WARN_REQUESTS_PER_SEC=600
  TOKEN=your_long_lived_access_token
  TRACK_ENTITIES=false
  VALIDATE_CONFIGURATION=true
  WEBSOCKET_URL=wss://custom.websocket.url
```

#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  AUTO_CONNECT_SOCKET: false
  AUTO_SCAN_CALL_PROXY: true
  BASE_URL: "http://custom.homeassistant.local:8123"
  EXPECT_RESPONSE_AFTER: 10
  MANAGE_REGISTRY: false
  MOCK_SOCKET: true
  RETRY_INTERVAL: 10
  SOCKET_AVG_DURATION: 10
  SOCKET_CRASH_REQUESTS_PER_SEC: 1000
  SOCKET_WARN_REQUESTS_PER_SEC: 600
  TOKEN: "your_long_lived_access_token"
  TRACK_ENTITIES: false
  VALIDATE_CONFIGURATION: true
  WEBSOCKET_URL: "wss://custom.websocket.url"
```

### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "AUTO_CONNECT_SOCKET": false,
    "AUTO_SCAN_CALL_PROXY": true,
    "BASE_URL": "http://custom.homeassistant.local:8123",
    "EXPECT_RESPONSE_AFTER": 10,
    "MANAGE_REGISTRY": false,
    "MOCK_SOCKET": true,
    "RETRY_INTERVAL": 10,
    "SOCKET_AVG_DURATION": 10,
    "SOCKET_CRASH_REQUESTS_PER_SEC": 1000,
    "SOCKET_WARN_REQUESTS_PER_SEC": 600,
    "TOKEN": "your_long_lived_access_token",
    "TRACK_ENTITIES": false,
    "VALIDATE_CONFIGURATION": true,
    "WEBSOCKET_URL": "wss://custom.websocket.url"
  }
}
```
