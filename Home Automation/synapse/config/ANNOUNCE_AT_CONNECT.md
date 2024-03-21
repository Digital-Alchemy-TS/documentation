## 📜 Description

Emit the entity list update every time this application is booted. digital-alchemy.reload() service available for manual reload.

- **type**: `boolean`
- required: `false`
- default: `false`
- project: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export ANNOUNCE_AT_CONNECT=false
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
ANNOUNCE_AT_CONNECT=false tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --announce_at_connect
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  ANNOUNCE_AT_CONNECT=false
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
synapse:
  ANNOUNCE_AT_CONNECT: false
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "synapse": {
    "ANNOUNCE_AT_CONNECT": false
  }
}
```