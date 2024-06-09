## 📜 Description

Validate the credentials, then quit.

- **type**: `boolean`
- required: `false`
- default: `false`
- project: [Hass](/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export VALIDATE_CONFIGURATION=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
VALIDATE_CONFIGURATION=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --validate_configuration
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  VALIDATE_CONFIGURATION=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  VALIDATE_CONFIGURATION: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "VALIDATE_CONFIGURATION": true
  }
}
```
