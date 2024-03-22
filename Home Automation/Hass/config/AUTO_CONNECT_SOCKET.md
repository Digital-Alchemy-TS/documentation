## 📜 Description

Websocket must be manually initialized if set to false.

- **type**: `boolean`
- required: `false`
- default: `true`
- project: [[Hass Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export AUTO_CONNECT_SOCKET=true
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
AUTO_CONNECT_SOCKET=true tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --auto_connect_socket
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[hass]
  AUTO_CONNECT_SOCKET=true
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
hass:
  AUTO_CONNECT_SOCKET: true
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "hass": {
    "AUTO_CONNECT_SOCKET": true
  }
}
```