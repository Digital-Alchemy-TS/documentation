## 📜 Description

Configuration property for cache provider, in seconds.

- **type**: `number`
- required: `false`
- default: `86400`
- project: [Core](/core)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CACHE_TTL=172800
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CACHE_TTL=172800 tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --cache_ttl=172800
# or
tsx src/main.ts --cache_ttl 172800
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name

```ini
[boilerplate]
  CACHE_TTL=172800
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_TTL: 172800
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_TTL": 172800
  }
}
```
