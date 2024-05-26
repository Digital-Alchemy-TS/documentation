## 📜 Description

Should the call proxy request a service listing at bootstrap?

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [Hass](/hass)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export AUTO_SCAN_CALL_PROXY=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
AUTO_SCAN_CALL_PROXY=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --auto_scan_call_proxy
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  AUTO_SCAN_CALL_PROXY=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  AUTO_SCAN_CALL_PROXY: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "AUTO_SCAN_CALL_PROXY": true
  }
}
```