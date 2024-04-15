## 📜 Description

Used to generate unique ids in home assistant. Defaults to application name.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [[Synapse Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export APPLICATION_IDENTIFIER=UniqueAppIdentifier
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
APPLICATION_IDENTIFIER=UniqueAppIdentifier tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --application_identifier=UniqueAppIdentifier
# or
tsx src/main.ts --application_identifier UniqueAppIdentifier
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[synapse]
  APPLICATION_IDENTIFIER=UniqueAppIdentifier
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
synapse:
  APPLICATION_IDENTIFIER: UniqueAppIdentifier
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "synapse": {
    "APPLICATION_IDENTIFIER": "UniqueAppIdentifier"
  }
}
```
