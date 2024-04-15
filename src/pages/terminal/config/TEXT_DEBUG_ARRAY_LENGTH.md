## 📜 Description

Util.inspect array length.

- **type**: `number`
- required: `false`
- default: `2`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export TEXT_DEBUG_ARRAY_LENGTH=2
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
TEXT_DEBUG_ARRAY_LENGTH=2 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --text_debug_array_length=2
# or
tsx src/main.ts --text_debug_array_length 2
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  TEXT_DEBUG_ARRAY_LENGTH=2
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  TEXT_DEBUG_ARRAY_LENGTH: 2
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "TEXT_DEBUG_ARRAY_LENGTH": 2
  }
}
```
