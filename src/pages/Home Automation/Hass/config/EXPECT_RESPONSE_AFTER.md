## 📜 Description

If sendMessage was set to expect a response, a warning will be emitted after this delay if one is not received.

- **type**: `number`
- required: `false`
- default: `5`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export EXPECT_RESPONSE_AFTER=5
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
EXPECT_RESPONSE_AFTER=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --expect_response_after=5
# or
tsx src/main.ts --expect_response_after 5
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  EXPECT_RESPONSE_AFTER=5
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  EXPECT_RESPONSE_AFTER: 5
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "EXPECT_RESPONSE_AFTER": 5
  }
}
```