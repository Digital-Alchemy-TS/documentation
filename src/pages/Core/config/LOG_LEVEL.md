## 📜 Description

Minimum log level to process.

- **type**: `string`
- required: `false`
- default: `trace`
- project: [[Core Overview]]
- enum: `silent` | `trace` | `info` | `warn` | `debug` | `error`

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export LOG_LEVEL=info
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
LOG_LEVEL=info tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --log_level=info
# or
tsx src/main.ts --log_level info
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[boilerplate]
  LOG_LEVEL=info
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
boilerplate:
  LOG_LEVEL: info
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "boilerplate": {
    "LOG_LEVEL": "info"
  }
}
```