## 📜 Description

How often to retry connecting on connection failure (ms).

- **type**: `number`
- required: `false`
- default: `5`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export RETRY_INTERVAL=5
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
RETRY_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --retry_interval=5
# or
tsx src/main.ts --retry_interval 5
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  RETRY_INTERVAL=5
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  RETRY_INTERVAL: 5
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "RETRY_INTERVAL": 5
  }
}
```