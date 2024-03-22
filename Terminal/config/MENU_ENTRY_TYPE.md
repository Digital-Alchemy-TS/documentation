## 📜 Description

Color for menu entry category types on the selected side.

- **type**: `string`
- required: `false`
- default: `"magenta.bold"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export MENU_ENTRY_TYPE="magenta.bold"
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
MENU_ENTRY_TYPE="magenta.bold" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --menu_entry_type="magenta.bold"
# or
tsx src/main.ts --menu_entry_type magenta.bold
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_ENTRY_TYPE=magenta.bold
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  MENU_ENTRY_TYPE: "magenta.bold"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_ENTRY_TYPE": "magenta.bold"
  }
}
```