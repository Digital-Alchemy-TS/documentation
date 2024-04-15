## 📜 Description

Default quantity of rows to render in prompts like arrayBuilder.

- **type**: `number`
- required: `false`
- default: `20`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export TABLE_RENDER_ROWS=20
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
TABLE_RENDER_ROWS=20 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --table_render_rows=20
# or
tsx src/main.ts --table_render_rows 20
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  TABLE_RENDER_ROWS=20
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  TABLE_RENDER_ROWS: 20
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "TABLE_RENDER_ROWS": 20
  }
}
```
