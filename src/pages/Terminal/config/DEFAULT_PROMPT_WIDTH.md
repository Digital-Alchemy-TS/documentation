## 📜 Description

Box width for prompts short text inputs.

- **type**: `number`
- required: `false`
- default: `50`
- project: [[Terminal Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export DEFAULT_PROMPT_WIDTH=50
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
DEFAULT_PROMPT_WIDTH=50 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --default_prompt_width=50
# or
tsx src/main.ts --default_prompt_width 50
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  DEFAULT_PROMPT_WIDTH=50
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
terminal:
  DEFAULT_PROMPT_WIDTH: 50
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "terminal": {
    "DEFAULT_PROMPT_WIDTH": 50
  }
}
```