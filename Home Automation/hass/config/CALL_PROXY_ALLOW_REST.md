## 📜 Description

Send commands from hass.call via rest instead of socket. Allow = only if socket is not connected.

- **type**: `string`
- required: `false`
- default: `allow`
- project: [[Hass Overview]]
- enum: `prefer` | `forbid` | `allow`

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CALL_PROXY_ALLOW_REST=allow
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CALL_PROXY_ALLOW_REST=allow tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --call_proxy_allow_rest=allow
# or
tsx src/main.ts --call_proxy_allow_rest allow
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  CALL_PROXY_ALLOW_REST=allow
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  CALL_PROXY_ALLOW_REST: allow
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "CALL_PROXY_ALLOW_REST": "allow"
  }
}
```