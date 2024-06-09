## 📜 Description

Redis is preferred if available.

- **type**: `string`
- required: `false`
- default: `memory`
- project: [Core](/core)
- enum: `redis` | `memory`

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CACHE_PROVIDER=redis
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CACHE_PROVIDER=redis tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --cache_provider=redis
# or
tsx src/main.ts --cache_provider redis
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name, `~/.config/my_app_name`

```ini
[boilerplate]
  CACHE_PROVIDER=redis
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_PROVIDER: redis
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_PROVIDER": "redis"
  }
}
```
