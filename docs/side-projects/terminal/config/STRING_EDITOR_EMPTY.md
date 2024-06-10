## 📜 Description

Color for string inputs when there is no content.

- **type**: `string`
- required: `false`
- default: `"bgBlue"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export STRING_EDITOR_EMPTY="bgBlue"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
STRING_EDITOR_EMPTY="bgBlue" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --string_editor_empty="bgBlue"
# or
tsx src/main.ts --string_editor_empty bgBlue
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  STRING_EDITOR_EMPTY=bgBlue
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  STRING_EDITOR_EMPTY: "bgBlue"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "STRING_EDITOR_EMPTY": "bgBlue"
  }
}
```
