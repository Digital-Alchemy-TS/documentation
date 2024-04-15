## 📜 Description

Used to generate unique ids in home assistant. Defaults to application name.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export APPLICATION_IDENTIFIER=UniqueAppIdentifier
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
APPLICATION_IDENTIFIER=UniqueAppIdentifier tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --application_identifier=UniqueAppIdentifier
# or
tsx src/main.ts --application_identifier UniqueAppIdentifier
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  APPLICATION_IDENTIFIER=UniqueAppIdentifier
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
synapse:
  APPLICATION_IDENTIFIER: UniqueAppIdentifier
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "synapse": {
    "APPLICATION_IDENTIFIER": "UniqueAppIdentifier"
  }
}
```