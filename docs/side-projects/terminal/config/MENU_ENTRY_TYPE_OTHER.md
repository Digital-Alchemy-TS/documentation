## 📜 Description

Color for menu entry category types on the other side.

- **type**: `string`
- required: `false`
- default: `"gray.bold"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export MENU_ENTRY_TYPE_OTHER="gray.bold"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
MENU_ENTRY_TYPE_OTHER="gray.bold" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --menu_entry_type_other="gray.bold"
# or
tsx src/main.ts --menu_entry_type_other gray.bold
```
### 📁 File
>  If your file does not have an extension, [Configuration](/docs/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_ENTRY_TYPE_OTHER=gray.bold
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  MENU_ENTRY_TYPE_OTHER: "gray.bold"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_ENTRY_TYPE_OTHER": "gray.bold"
  }
}
```
