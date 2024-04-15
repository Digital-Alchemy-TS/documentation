## 📜 Description

Base URL for the server.

- **type**: `string`
- required: `true`
- default: `undefined`
- project: [[Gotify Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export BASE_URL=https://your-gotify-server.com
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
BASE_URL=https://your-gotify-server.com tsx src/main.ts
```

### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --base_url=https://your-gotify-server.com
# or
tsx src/main.ts --base_url https://your-gotify-server.com
```

### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[gotify]
  BASE_URL=https://your-gotify-server.com
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
gotify:
  BASE_URL: https://your-gotify-server.com
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "gotify": {
    "BASE_URL": "https://your-gotify-server.com"
  }
}
```