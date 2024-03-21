## 📜 Description

How many seconds worth of requests to use in avg for math in REQ_PER_SEC calculations.

- **type**: `number`
- required: `false`
- default: `5`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export SOCKET_AVG_DURATION=5
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
SOCKET_AVG_DURATION=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --socket_avg_duration=5
# or
tsx src/main.ts --socket_avg_duration 5
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  SOCKET_AVG_DURATION=5
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  SOCKET_AVG_DURATION: 5
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "SOCKET_AVG_DURATION": 5
  }
}
```