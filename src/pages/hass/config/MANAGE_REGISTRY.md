## 📜 Description

Override calculated value if it's breaking or you want something custom. Make sure to use "`ws[s]://`" scheme.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [Hass](/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export MANAGE_REGISTRY=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
MANAGE_REGISTRY=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --MANAGE_REGISTRY
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  MANAGE_REGISTRY=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  MANAGE_REGISTRY: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "MANAGE_REGISTRY": "true"
  }
}
```
