## 📜 Description

Base URL for the server.

- **type**: `string`
- required: `true`
- default: `undefined`
- project: [Gotify](/support-libraries/gotify)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export BASE_URL=https://your-gotify-server.com
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
BASE_URL=https://your-gotify-server.com tsx src/main.ts
```

### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --base_url=https://your-gotify-server.com
# or
tsx src/main.ts --base_url https://your-gotify-server.com
```

### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[gotify]
  BASE_URL=https://your-gotify-server.com
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
gotify:
  BASE_URL: https://your-gotify-server.com
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "gotify": {
    "BASE_URL": "https://your-gotify-server.com"
  }
}
```
