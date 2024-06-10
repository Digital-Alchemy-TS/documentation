## 📜 Description

Util.inspect object depth.

- **type**: `number`
- required: `false`
- default: `5`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export TEXT_DEBUG_DEPTH=5
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
TEXT_DEBUG_DEPTH=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --text_debug_depth=5
# or
tsx src/main.ts --text_debug_depth 5
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  TEXT_DEBUG_DEPTH=5
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  TEXT_DEBUG_DEPTH: 5
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "TEXT_DEBUG_DEPTH": 5
  }
}
```
