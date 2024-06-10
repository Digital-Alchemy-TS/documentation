## 📜 Description

When tracking state changes for a sequence event, another change must happen inside this time window.

- **type**: `number`
- required: `false`
- default: `1500`
- project: [Automation](/automation)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export SEQUENCE_TIMEOUT=1500
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
SEQUENCE_TIMEOUT=1500 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --sequence_timeout=1500
# or
tsx src/main.ts --sequence_timeout 1500
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  SEQUENCE_TIMEOUT=1500
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  SEQUENCE_TIMEOUT: 1500
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "SEQUENCE_TIMEOUT": 1500
  }
}
```
