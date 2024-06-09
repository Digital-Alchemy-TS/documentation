## 📜 Description

Text for the acknowledge component to display if nothing is provided.

- **type**: `string`
- required: `false`
- default: `"Any key to continue"`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export DEFAULT_ACKNOWLEDGE_MESSAGE="Any key to continue"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
DEFAULT_ACKNOWLEDGE_MESSAGE="Any key to continue" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --default_acknowledge_message="Any key to continue"
# or
tsx src/main.ts --default_acknowledge_message "Any key to continue"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  DEFAULT_ACKNOWLEDGE_MESSAGE=Any key to continue
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  DEFAULT_ACKNOWLEDGE_MESSAGE: "Any key to continue"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "DEFAULT_ACKNOWLEDGE_MESSAGE": "Any key to continue"
  }
}
```
