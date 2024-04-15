## 📜 Description

Verify continue to match their desired state as defined by the room's current scene.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [[Automation Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export AGGRESSIVE_SCENES=true
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
AGGRESSIVE_SCENES=true tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --aggressive_scenes
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  AGGRESSIVE_SCENES=true
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
automation:
  AGGRESSIVE_SCENES: true
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "automation": {
    "AGGRESSIVE_SCENES": true
  }
}
```