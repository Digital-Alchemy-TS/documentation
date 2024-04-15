## 📜 Description

If sendMessage was set to expect a response, a warning will be emitted after this delay if one is not received.

- **type**: `number`
- required: `false`
- default: `5`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export EXPECT_RESPONSE_AFTER=5
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
EXPECT_RESPONSE_AFTER=5 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --expect_response_after=5
# or
tsx src/main.ts --expect_response_after 5
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  EXPECT_RESPONSE_AFTER=5
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
hass:
  EXPECT_RESPONSE_AFTER: 5
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "hass": {
    "EXPECT_RESPONSE_AFTER": 5
  }
}
```
