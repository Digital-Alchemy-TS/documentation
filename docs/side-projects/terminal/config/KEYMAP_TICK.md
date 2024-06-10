## 📜 Description

Text to display in front of individual items in the keymap.

- **type**: `string`
- required: `false`
- default: `{blue.dim > }`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export KEYMAP_TICK="{blue.dim > }"
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
KEYMAP_TICK="{blue.dim > }" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --keymap_tick="{blue.dim > }"
# or
tsx src/main.ts --keymap_tick "{blue.dim > }"
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  KEYMAP_TICK={blue.dim > }
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  KEYMAP_TICK: "{blue.dim > }"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "KEYMAP_TICK": "{blue.dim > }"
  }
}
```
