## 📜 Description

Persistence type

- **type**: `string`
- **required**: `false`
- **default**: `cache`
- **enum**: `cache`, `none`, `file`, `external`
- **project**: [Synapse](/home-automation/synapse)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export STORAGE=file
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
HEARTBEAT_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --storage=file
# or
tsx src/main.ts --storage file
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  STORAGE=file
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
synapse:
  STORAGE: file
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "synapse": {
    "STORAGE": file
  }
}
```
