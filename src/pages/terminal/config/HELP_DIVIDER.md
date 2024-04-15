
## 📜 Description

Color for the blue horizontal divider in the help display.

- **type**: `string`
- required: `false`
- default: `"blue.dim"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export HELP_DIVIDER="blue.dim"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
HELP_DIVIDER="blue.dim" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --help_divider="blue.dim"
# or
tsx src/main.ts --help_divider "blue.dim"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  HELP_DIVIDER=blue.dim
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  HELP_DIVIDER: "blue.dim"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "HELP_DIVIDER": "blue.dim"
  }
}
```
