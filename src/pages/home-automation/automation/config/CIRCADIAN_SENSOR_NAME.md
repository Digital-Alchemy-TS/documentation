## 📜 Description

Sensor for reading / writing current light temperature to.

- **type**: `string`
- required: `false`
- default: `"Light temperature"`
- project: [Automation](/home-automation/automation)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_SENSOR_NAME="Light temperature"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CIRCADIAN_SENSOR_NAME="Light temperature" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --circadian_sensor_name="Light temperature"
# or
tsx src/main.ts --circadian_sensor_name "Light temperature"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_SENSOR_NAME="Light temperature"
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_SENSOR_NAME: "Light temperature"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_SENSOR_NAME": "Light temperature"
  }
}
```
