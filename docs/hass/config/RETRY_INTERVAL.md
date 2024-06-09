## 📜 Description

How often to retry connecting on connection failure (ms).

- **type**: `number`
- required: `false`
- default: `5`
- project: [Hass](/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export RETRY_INTERVAL=5
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
RETRY_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --retry_interval=5
# or
tsx src/main.ts --retry_interval 5
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  RETRY_INTERVAL=5
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  RETRY_INTERVAL: 5
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "RETRY_INTERVAL": 5
  }
}
```
