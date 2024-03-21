## 📜 Description

Number of entities to adjust at the same time. Higher values increase load.

- **type**: `number`
- required: `false`
- default: `3`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CIRCADIAN_RATE=3
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CIRCADIAN_RATE=3 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --circadian_rate=3
# or
tsx src/main.ts --circadian_rate 3
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  CIRCADIAN_RATE=3
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  CIRCADIAN_RATE: 3
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "CIRCADIAN_RATE": 3
  }
}
```