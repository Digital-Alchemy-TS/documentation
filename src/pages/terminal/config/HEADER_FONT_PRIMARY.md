## 📜 Description

Figlet font for the primary header.

- **type**: `string`
- required: `false`
- default: `"ANSI Regular"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export HEADER_FONT_PRIMARY="ANSI Regular"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
HEADER_FONT_PRIMARY="ANSI Regular" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --header_font_primary="ANSI Regular"
# or
tsx src/main.ts --header_font_primary "ANSI Regular"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  HEADER_FONT_PRIMARY=ANSI Regular
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  HEADER_FONT_PRIMARY: "ANSI Regular"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "HEADER_FONT_PRIMARY": "ANSI Regular"
  }
}
```
