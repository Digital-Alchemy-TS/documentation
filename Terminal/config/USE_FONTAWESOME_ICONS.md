## 📜 Description

Utilize font awesome icons in prompts. Requires font to be installed.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export USE_FONTAWESOME_ICONS=true
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
USE_FONTAWESOME_ICONS=true tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --use_fontawesome_icons
```

### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  USE_FONTAWESOME_ICONS=true
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  USE_FONTAWESOME_ICONS: true
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "USE_FONTAWESOME_ICONS": true
  }
}
```