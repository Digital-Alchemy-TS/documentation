## 📜 Description

Color for string inputs when there is content.

- **type**: `string`
- required: `false`
- default: `"bgWhite"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export STRING_EDITOR_CONTENT="bgWhite"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
STRING_EDITOR_CONTENT="bgWhite" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --string_editor_content="bgWhite"
# or
tsx src/main.ts --string_editor_content bgWhite
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  STRING_EDITOR_CONTENT=bgWhite
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  STRING_EDITOR_CONTENT: "bgWhite"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "STRING_EDITOR_CONTENT": "bgWhite"
  }
}
```
