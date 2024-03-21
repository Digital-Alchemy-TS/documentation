## 📜 Description

Validate the credentials, then quit.

- **type**: `boolean`
- required: `false`
- default: `false`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export VALIDATE_CONFIGURATION=true
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
VALIDATE_CONFIGURATION=true tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --validate_configuration
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  VALIDATE_CONFIGURATION=true
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  VALIDATE_CONFIGURATION: true
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "VALIDATE_CONFIGURATION": true
  }
}
```