## 📜 Description

Override calculated value if it's breaking or you want something custom. Make sure to use "`ws[s]://`" scheme.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --websocket_url=wss://homeassistant.local:8123/api/websocket
# or
tsx src/main.ts --websocket_url wss://homeassistant.local:8123/api/websocket
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  WEBSOCKET_URL: wss://homeassistant.local:8123/api/websocket
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "WEBSOCKET_URL": "wss://homeassistant.local:8123/api/websocket"
  }
}
```