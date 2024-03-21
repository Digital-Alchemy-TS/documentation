## 📜 Description

Url to reach Home Assistant at.

- **type**: `string`
- required: `false`
- default: `http://homeassistant.local:8123`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export BASE_URL=http://homeassistant.local:8123
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
BASE_URL=http://homeassistant.local:8123 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --base_url=http://homeassistant.local:8123
# or
tsx src/main.ts --base_url http://homeassistant.local:8123
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  BASE_URL=http://homeassistant.local:8123
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  BASE_URL: http://homeassistant.local:8123
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "BASE_URL": "http://homeassistant.local:8123"
  }
}
```