## 📜 Description

Current light temperature must be at least this much off target in order to be eligible for adjustment.

- **type**: `number`
- required: `false`
- default: `50`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_DIFF_THRESHOLD=50
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CIRCADIAN_DIFF_THRESHOLD=50 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --circadian_diff_threshold=50
# or
tsx src/main.ts --circadian_diff_threshold 50
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_DIFF_THRESHOLD=50
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_DIFF_THRESHOLD: 50
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_DIFF_THRESHOLD": 50
  }
}
```