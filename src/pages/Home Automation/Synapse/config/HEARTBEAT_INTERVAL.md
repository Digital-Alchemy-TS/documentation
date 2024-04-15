## 📜 Description

Seconds between heartbeats.

- **type**: `number`
- **required**: `false`
- **default**: `5`
- **project**: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export HEARTBEAT_INTERVAL=5
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
HEARTBEAT_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --heartbeat_interval=5
# or
tsx src/main.ts --heartbeat_interval 5
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  HEARTBEAT_INTERVAL=5
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
synapse:
  HEARTBEAT_INTERVAL: 5
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "synapse": {
    "HEARTBEAT_INTERVAL": 5
  }
}
```