## 📜 Description

Color for menu entries, selected item.

- **type**: `string`
- required: `false`
- default: `"bgBlueBright.black"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export MENU_ENTRY_SELECTED="bgBlueBright.black"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
MENU_ENTRY_SELECTED="bgBlueBright.black" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --menu_entry_selected="bgBlueBright.black"
# or
tsx src/main.ts --menu_entry_selected bgBlueBright.black
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_ENTRY_SELECTED=bgBlueBright.black
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  MENU_ENTRY_SELECTED: "bgBlueBright.black"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_ENTRY_SELECTED": "bgBlueBright.black"
  }
}
```