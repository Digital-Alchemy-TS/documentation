## 📜 Description

Emit a pulse so the extension knows the service is alive.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export EMIT_HEARTBEAT=true
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
EMIT_HEARTBEAT=true tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --emit_heartbeat
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  EMIT_HEARTBEAT=true
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
synapse:
  EMIT_HEARTBEAT: true
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "synapse": {
    "EMIT_HEARTBEAT": true
  }
}
```