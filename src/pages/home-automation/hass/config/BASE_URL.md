## 📜 Description

Url to reach Home Assistant at.

- **type**: `string`
- required: `false`
- default: `http://homeassistant.local:8123`
- project: [Hass](/home-automation/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export BASE_URL=http://homeassistant.local:8123
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
BASE_URL=http://homeassistant.local:8123 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --base_url=http://homeassistant.local:8123
# or
tsx src/main.ts --base_url http://homeassistant.local:8123
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  BASE_URL=http://homeassistant.local:8123
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  BASE_URL: http://homeassistant.local:8123
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "BASE_URL": "http://homeassistant.local:8123"
  }
}
```
