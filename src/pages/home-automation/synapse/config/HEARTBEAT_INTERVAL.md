## 📜 Description

Seconds between heartbeats.

- **type**: `number`
- **required**: `false`
- **default**: `5`
- **project**: [Synapse](/home-automation/synapse)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export HEARTBEAT_INTERVAL=5
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
HEARTBEAT_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --heartbeat_interval=5
# or
tsx src/main.ts --heartbeat_interval 5
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  HEARTBEAT_INTERVAL=5
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
synapse:
  HEARTBEAT_INTERVAL: 5
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "synapse": {
    "HEARTBEAT_INTERVAL": 5
  }
}
```
