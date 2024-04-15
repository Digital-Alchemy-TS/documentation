## 📜 Description

Define a file to write types to. Autodetect = default behavior.

- **type**: `string`
- required: `false`
- default: `Autodetect`
- project: [Type Writer](/home-automation/type-writer)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export TARGET_FILE=path/to/your/types.ts
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
TARGET_FILE=path/to/your/types.ts tsx src/main.ts
```

### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --target_file=path/to/your/types.ts
# or
tsx src/main.ts --target_file path/to/your/types.ts
```

### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[type_writer]
  TARGET_FILE=path/to/your/types.ts
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
type_writer:
  TARGET_FILE: path/to/your/types.ts
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "type_writer": {
    "TARGET_FILE": "path/to/your/types.ts"
  }
}
```
