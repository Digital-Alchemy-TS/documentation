## 📜 Description

Use a prefix with all cache keys. If blank, then the application name is used.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [[Core Overview]]

### 💡 Example Usage

### 🌍 Environment

> [!summary] Set up as an environment variable for your shell, then run the script
```bash
export CACHE_PREFIX=myCachePrefix
tsx src/main.ts
```
> [!summary] Set up as an environment variable for just the single run

```bash
CACHE_PREFIX=myCachePrefix tsx src/main.ts
```
### 🎛️ CLI Switch

> [!summary] Provide your config as a switch
```bash
tsx src/main.ts --cache_prefix=myCachePrefix
# or
tsx src/main.ts --cache_prefix myCachePrefix
```
### 📁 File
> [!tip] If your file does not have an extension, [[configuration]] will do auto
#### 📘 ini

> [!example] 
> `.my_app_name`, `~/.config/my_app_name`

```ini
[boilerplate]
  CACHE_PREFIX=myCachePrefix
```
#### 📄 yaml

> [!example]
> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_PREFIX: myCachePrefix
```
### 🗃️ json

> [!example]
> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_PREFIX": "myCachePrefix"
  }
}
```