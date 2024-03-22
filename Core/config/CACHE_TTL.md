## 📜 Description

Configuration property for cache provider, in seconds.

- **type**: `number`
- required: `false`
- default: `86400`
- project: [[Core Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CACHE_TTL=172800
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CACHE_TTL=172800 tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --cache_ttl=172800
# or
tsx src/main.ts --cache_ttl 172800
```
### 📁 File
> [!tip] If your file does not have an extension, [[Configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name

```ini
[boilerplate]
  CACHE_TTL=172800
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_TTL: 172800
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_TTL": 172800
  }
}
```