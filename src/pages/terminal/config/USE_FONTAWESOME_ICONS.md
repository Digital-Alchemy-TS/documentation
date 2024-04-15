## 📜 Description

Utilize font awesome icons in prompts. Requires font to be installed.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export USE_FONTAWESOME_ICONS=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
USE_FONTAWESOME_ICONS=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --use_fontawesome_icons
```

### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  USE_FONTAWESOME_ICONS=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  USE_FONTAWESOME_ICONS: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "USE_FONTAWESOME_ICONS": true
  }
}
```
