## 📜 Description

Configuration property for cache provider, does not apply to memory caching.

- **type**: `string`
- required: `false`
- default: `redis://localhost:6379`
- project: [[Core Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export REDIS_URL=redis://myredisserver:6379
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
REDIS_URL=redis://myredisserver:6379 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --redis_url=redis://myredisserver:6379
# or
tsx src/main.ts --redis_url redis://myredisserver:6379
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[boilerplate]
  REDIS_URL=redis://myredisserver:6379
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
boilerplate:
  REDIS_URL: redis://myredisserver:6379
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "boilerplate": {
    "REDIS_URL": "redis://myredisserver:6379"
  }
}