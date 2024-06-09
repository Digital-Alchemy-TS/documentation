## 📜 Description

Minimum log level to process.

- **type**: `string`
- required: `false`
- default: `trace`
- project: [Core](/core)
- enum: `silent` | `trace` | `info` | `warn` | `debug` | `error`

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export LOG_LEVEL=info
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
LOG_LEVEL=info tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --log_level=info
# or
tsx src/main.ts --log_level info
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[boilerplate]
  LOG_LEVEL=info
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
boilerplate:
  LOG_LEVEL: info
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "boilerplate": {
    "LOG_LEVEL": "info"
  }
}
```
