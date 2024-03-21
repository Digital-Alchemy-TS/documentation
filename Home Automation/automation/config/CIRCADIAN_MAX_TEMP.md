## 📜 Description

Maximum color temperature for circadian lighting. Used at solar noon.

- **type**: `number`
- required: `false`
- default: `5500`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_MAX_TEMP=5500
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CIRCADIAN_MAX_TEMP=5500 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --circadian_max_temp=5500
# or
tsx src/main.ts --circadian_max_temp 5500
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_MAX_TEMP=5500
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_MAX_TEMP: 5500
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_MAX_TEMP": 5500
  }
}
```