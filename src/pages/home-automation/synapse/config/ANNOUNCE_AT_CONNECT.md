## 📜 Description

Emit the entity list update every time this application is booted. digital-alchemy.reload() service available for manual reload.

- **type**: `boolean`
- required: `false`
- default: `false`
- project: [Synapse](/home-automation/synapse)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export ANNOUNCE_AT_CONNECT=false
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
ANNOUNCE_AT_CONNECT=false tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --announce_at_connect
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  ANNOUNCE_AT_CONNECT=false
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
synapse:
  ANNOUNCE_AT_CONNECT: false
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "synapse": {
    "ANNOUNCE_AT_CONNECT": false
  }
}
```
