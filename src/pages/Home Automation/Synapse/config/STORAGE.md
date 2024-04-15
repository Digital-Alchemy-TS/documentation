## 📜 Description

Persistence type

- **type**: `string`
- **required**: `false`
- **default**: `cache`
- **enum**: `cache`, `none`, `file`, `external`
- **project**: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export STORAGE=file
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
HEARTBEAT_INTERVAL=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --storage=file
# or
tsx src/main.ts --storage file
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  STORAGE=file
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
synapse:
  STORAGE: file
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "synapse": {
    "STORAGE": file
  }
}
```