## 📜 Description

Text to add in front of prompt messages.

- **type**: `string`
- required: `false`
- default: `{blue ?}`
- project: [Terminal](/terminal)

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run script
```bash
export PROMPT_QUESTION="{blue ?}"
tsx src/main.ts
```
> [!summary] Set up as environment variable for just the single run

```bash
PROMPT_QUESTION="{blue ?}" tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --prompt_question="{blue ?}"
# or
tsx src/main.ts --prompt_question {blue ?}
```
### 📁 File
>  If your file does not have an extension, [Configuration](/docs/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[terminal]
  PROMPT_QUESTION={blue ?}
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
terminal:
  PROMPT_QUESTION: "{blue ?}"
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "terminal": {
    "PROMPT_QUESTION": "{blue ?}"
  }
}
```
