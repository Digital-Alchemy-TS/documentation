## 📜 Description

Figlet font for the secondary header.

- **type**: `string`
- required: `false`
- default: `"Pagga"`
- project: [[Terminal Overview]]

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

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --header_font_secondary="Pagga"
# or
tsx src/main.ts --header_font_secondary "Pagga"
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  HEADER_FONT_SECONDARY=Pagga
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  HEADER_FONT_SECONDARY: "Pagga"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "HEADER_FONT_SECONDARY": "Pagga"
  }
}
```