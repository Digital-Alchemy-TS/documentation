## 📜 Description

Long-lived access token to Home Assistant.

- **type**: `string`
- required: `true`
- default: `undefined`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export TOKEN=YourLongLivedAccessToken
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
TOKEN=YourLongLivedAccessToken tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] This configuration is primarily intended for environmental setup.

### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  TOKEN=YourLongLivedAccessToken
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  TOKEN: YourLongLivedAccessToken
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "TOKEN": "YourLongLivedAccessToken"
  }
}
```