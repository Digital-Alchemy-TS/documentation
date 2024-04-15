## 📜 Description

Application token.

- **type**: `string`
- required: `true`
- default: `undefined`
- project: [[Gotify Overview]]

### 💡 Example Usage

### 🌍 Environment

Serialize simple string values for the environment:

```bash
export TOKEN=YourGotifyAppToken
tsx src/main.ts
```

### 🎛️ CLI Switch

Provide your configuration as a switch:

```bash
tsx src/main.ts --token=YourGotifyAppToken
```

### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[gotify]
  TOKEN=YourGotifyAppToken
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
gotify:
  TOKEN: YourGotifyAppToken
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "gotify": {
    "TOKEN": "YourGotifyAppToken"
  }
}
```
