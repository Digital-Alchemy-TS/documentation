## 📜 Description

When tracking state changes for a sequence event, another change must happen inside this time window.

- **type**: `number`
- required: `false`
- default: `1500`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export SEQUENCE_TIMEOUT=1500
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
SEQUENCE_TIMEOUT=1500 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --sequence_timeout=1500
# or
tsx src/main.ts --sequence_timeout 1500
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  SEQUENCE_TIMEOUT=1500
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  SEQUENCE_TIMEOUT: 1500
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "SEQUENCE_TIMEOUT": 1500
  }
}
```
