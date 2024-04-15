## 📜 Description

Color for menu entries, same column as cursor, not selected.

- **type**: `string`
- required: `false`
- default: `"white"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export MENU_ENTRY_NORMAL="white"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
MENU_ENTRY_NORMAL="white" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --menu_entry_normal="white"
# or
tsx src/main.ts --menu_entry_normal "white"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_ENTRY_NORMAL=white
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  MENU_ENTRY_NORMAL: "white"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_ENTRY_NORMAL": "white"
  }
}
```
