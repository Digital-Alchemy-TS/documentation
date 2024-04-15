## 📜 Description

Emit warnings if the home controller attempts to send more than X messages to Home Assistant inside of a second.

- **type**: `number`
- required: `false`
- default: `300`
- project: [Hass](/home-automation/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export SOCKET_WARN_REQUESTS_PER_SEC=300
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
SOCKET_WARN_REQUESTS_PER_SEC=300 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --socket_warn_requests_per_sec=300
# or
tsx src/main.ts --socket_warn_requests_per_sec 300
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  SOCKET_WARN_REQUESTS_PER_SEC=300
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  SOCKET_WARN_REQUESTS_PER_SEC: 300
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "SOCKET_WARN_REQUESTS_PER_SEC": 300
  }
}
```
