## 📜 Description

Chalk highlighting to apply to fuzzy search.

- **type**: `string`
- required: `false`
- default: `"red.bold.underline"`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export FUZZY_HIGHLIGHT="red.bold.underline"
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
FUZZY_HIGHLIGHT="red.bold.underline" tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --fuzzy_highlight="red.bold.underline"
# or
tsx src/main.ts --fuzzy_highlight "red.bold.underline"
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  FUZZY_HIGHLIGHT=red.bold.underline
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  FUZZY_HIGHLIGHT: "red.bold.underline"
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "FUZZY_HIGHLIGHT": "red.bold.underline"
  }
}
```