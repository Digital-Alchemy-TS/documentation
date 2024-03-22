## 📜 Description

Alternate color for menus search box colors.

- **type**: `string`
- required: `false`
- default: `"bgMagenta"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export MENU_SEARCHBOX_NORMAL="bgMagenta"
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
MENU_SEARCHBOX_NORMAL="bgMagenta" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --menu_searchbox_normal="bgMagenta"
# or
tsx src/main.ts --menu_searchbox_normal bgMagenta
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_SEARCHBOX_NORMAL=bgMagenta
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  MENU_SEARCHBOX_NORMAL: "bgMagenta"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_SEARCHBOX_NORMAL": "bgMagenta"
  }
}
```