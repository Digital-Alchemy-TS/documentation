## 📜 Description

Override calculated value if it's breaking or you want something custom. Make sure to use "`ws[s]://`" scheme.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --websocket_url=wss://homeassistant.local:8123/api/websocket
# or
tsx src/main.ts --websocket_url wss://homeassistant.local:8123/api/websocket
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  WEBSOCKET_URL=wss://homeassistant.local:8123/api/websocket
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  WEBSOCKET_URL: wss://homeassistant.local:8123/api/websocket
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "WEBSOCKET_URL": "wss://homeassistant.local:8123/api/websocket"
  }
}
```
