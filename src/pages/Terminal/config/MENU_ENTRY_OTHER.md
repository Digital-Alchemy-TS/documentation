## 📜 Description

Color for menu entries, other column from cursor.

- **type**: `string`
- required: `false`
- default: `"gray"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export MENU_ENTRY_OTHER="gray"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
MENU_ENTRY_OTHER="gray" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --menu_entry_other="gray"
# or
tsx src/main.ts --menu_entry_other gray
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_ENTRY_OTHER=gray
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  MENU_ENTRY_OTHER: "gray"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_ENTRY_OTHER": "gray"
  }
}
```