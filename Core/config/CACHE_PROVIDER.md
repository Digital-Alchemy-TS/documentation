## 📜 Description

Redis is preferred if available.

- **type**: `string`
- required: `false`
- default: `memory`
- project: [[Core Overview]]
- enum: `redis` | `memory`

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CACHE_PROVIDER=redis
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CACHE_PROVIDER=redis tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --cache_provider=redis
# or
tsx src/main.ts --cache_provider redis
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name, `~/.config/my_app_name`

```ini
[boilerplate]
  CACHE_PROVIDER=redis
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_PROVIDER: redis
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_PROVIDER": "redis"
  }
}
```