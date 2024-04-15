## 📜 Description

Color for the smaller lower header.

- **type**: `string`
- required: `false`
- default: `"magenta"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export HEADER_COLOR_SECONDARY="magenta"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
HEADER_COLOR_SECONDARY="magenta" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --header_color_secondary="magenta"
# or
tsx src/main.ts --header_color_secondary "magenta"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  HEADER_COLOR_SECONDARY=magenta
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  HEADER_COLOR_SECONDARY: "magenta"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "HEADER_COLOR_SECONDARY": "magenta"
  }
}
```
