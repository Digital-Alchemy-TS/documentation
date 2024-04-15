## 📜 Description

Minimum color temperature for circadian lighting. Used while it's dark out.

- **type**: `number`
- required: `false`
- default: `2000`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_MIN_TEMP=2000
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CIRCADIAN_MIN_TEMP=2000 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --circadian_min_temp=2000
# or
tsx src/main.ts --circadian_min_temp 2000
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_MIN_TEMP=2000
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_MIN_TEMP: 2000
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_MIN_TEMP": 2000
  }
}
```
