## 📜 Description

Item quantity in menus / lists.

- **type**: `number`
- required: `false`
- default: `20`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export PAGE_SIZE=20
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
PAGE_SIZE=20 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --page_size=20
# or
tsx src/main.ts --page_size 20
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  PAGE_SIZE=20
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  PAGE_SIZE: 20
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "PAGE_SIZE": 20
  }
}
```
