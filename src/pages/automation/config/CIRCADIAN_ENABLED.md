## 📜 Description

Take responsibility for generating [CIRCADIAN_SENSOR] and emitting updates.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [Automation](/automation)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_ENABLED=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CIRCADIAN_ENABLED=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --circadian_enabled
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_ENABLED=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_ENABLED: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_ENABLED": true
  }
}
```
