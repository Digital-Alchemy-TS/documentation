## 📜 Description

Artificial delay to add.

- **type**: `number`
- required: `false`
- default: `300`
- project: [Automation](/home-automation/automation)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_THROTTLE=300
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CIRCADIAN_THROTTLE=300 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --circadian_throttle=300
# or
tsx src/main.ts --circadian_throttle 300
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_THROTTLE=300
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_THROTTLE: 300
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_THROTTLE": 300
  }
}
```
