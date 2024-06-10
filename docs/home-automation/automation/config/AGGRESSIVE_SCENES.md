## 📜 Description

Verify continue to match their desired state as defined by the room's current scene.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [Automation](/automation)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export AGGRESSIVE_SCENES=true
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
AGGRESSIVE_SCENES=true tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --aggressive_scenes
```
### 📁 File
>  If your file does not have an extension, [Configuration](/docs/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[automation]
  AGGRESSIVE_SCENES=true
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
automation:
  AGGRESSIVE_SCENES: true
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "automation": {
    "AGGRESSIVE_SCENES": true
  }
}
```
