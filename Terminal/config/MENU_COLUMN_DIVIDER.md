## 📜 Description

Left/right divider for menus.

- **type**: `string`
- required: `false`
- default: `"{blue.dim |}"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export MENU_COLUMN_DIVIDER="{blue.dim |}"
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
MENU_COLUMN_DIVIDER="{blue.dim |}" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --menu_column_divider="{blue.dim |}"
# or
tsx src/main.ts --menu_column_divider "{blue.dim |}"
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_COLUMN_DIVIDER={blue.dim |}
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  MENU_COLUMN_DIVIDER: "{blue.dim |}"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_COLUMN_DIVIDER": "{blue.dim |}"
  }
}
```