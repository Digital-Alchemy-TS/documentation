## 📜 Description

Figlet font for the secondary header.

- **type**: `string`
- required: `false`
- default: `"Pagga"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export HEADER_FONT_SECONDARY="Pagga"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
HEADER_FONT_SECONDARY="Pagga" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --header_font_secondary="Pagga"
# or
tsx src/main.ts --header_font_secondary "Pagga"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  HEADER_FONT_SECONDARY=Pagga
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  HEADER_FONT_SECONDARY: "Pagga"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "HEADER_FONT_SECONDARY": "Pagga"
  }
}
```
