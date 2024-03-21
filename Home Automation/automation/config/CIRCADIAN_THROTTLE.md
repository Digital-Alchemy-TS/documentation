## 📜 Description

Artificial delay to add.

- **type**: `number`
- required: `false`
- default: `300`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_THROTTLE=300
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CIRCADIAN_THROTTLE=300 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --circadian_throttle=300
# or
tsx src/main.ts --circadian_throttle 300
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_THROTTLE=300
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_THROTTLE: 300
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_THROTTLE": 300
  }
}
```