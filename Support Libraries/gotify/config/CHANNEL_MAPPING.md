## 📜 Description

Mapping of application names to tokens. Keep your keys out of the code!

- **type**: `record`
- required: `false`
- default: `{}`
- project: [[Gotify Overview]]

### 💡 Example Usage

### 🌍 Environment

For complex structures like records, serialize the object to a JSON string:

```bash
export CHANNEL_MAPPING='{"made_up_app_name": "hashthing", "made_up_app_name_2": "Aq1JCnFARhEg8ok", "made_up_app_name_3": "like that one"}'
tsx src/main.ts
```

### 🎛️ CLI Switch

Provide the configuration as a serialized JSON string via CLI switch:

```bash
tsx src/main.ts --channel_mapping='{"made_up_app_name": "hashthing", "made_up_app_name_2": "Aq1JCnFARhEg8ok", "made_up_app_name_3": "like that one"}'
```

### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[gotify.CHANNEL_MAPPING]
  made_up_app_name=hashthing
  made_up_app_name_2=Aq1JCnFARhEg8ok
  made_up_app_name_3=like that one
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
gotify:
  CHANNEL_MAPPING:
    made_up_app_name: hashthing
    made_up_app_name_2: Aq1JCnFARhEg8ok
    made_up_app_name_3: like that one
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "gotify": {
    "CHANNEL_MAPPING": {
      "made_up_app_name": "hashthing",
      "made_up_app_name_2": "Aq1JCnFARhEg8ok",
      "made_up_app_name_3": "like that one"
    }
  }
}
```