## 📜 Description

Background color for search boxes when there is content.

- **type**: `string`
- required: `false`
- default: `"bgCyan"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export MENU_SEARCHBOX_CONTENT="bgCyan"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
MENU_SEARCHBOX_CONTENT="bgCyan" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --menu_searchbox_content="bgCyan"
# or
tsx src/main.ts --menu_searchbox_content bgCyan
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  MENU_SEARCHBOX_CONTENT=bgCyan
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  MENU_SEARCHBOX_CONTENT: "bgCyan"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "MENU_SEARCHBOX_CONTENT": "bgCyan"
  }
}
```
