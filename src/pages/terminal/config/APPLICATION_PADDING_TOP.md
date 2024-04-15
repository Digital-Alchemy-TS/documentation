## 📜 Description

Automatic offsets for header. POC / deprecated.

- **type**: `number`
- required: `false`
- default: `1`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export APPLICATION_PADDING_TOP=1
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
APPLICATION_PADDING_TOP=1 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --application_padding_top=1
# or
tsx src/main.ts --application_padding_top 1
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  APPLICATION_PADDING_TOP=1
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  APPLICATION_PADDING_TOP: 1
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "APPLICATION_PADDING_TOP": 1
  }
}
```
