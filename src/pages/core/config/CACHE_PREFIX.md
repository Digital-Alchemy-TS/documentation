## 📜 Description

Use a prefix with all cache keys. If blank, then the application name is used.

- **type**: `string`
- required: `false`
- default: `undefined`
- project: [Core](/core)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CACHE_PREFIX=myCachePrefix
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CACHE_PREFIX=myCachePrefix tsx src/main.ts
```
### 🎛️ CLI Switch

> Provide your config as a switch
```bash
tsx src/main.ts --cache_prefix=myCachePrefix
# or
tsx src/main.ts --cache_prefix myCachePrefix
```
### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[boilerplate]
  CACHE_PREFIX=myCachePrefix
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
boilerplate:
  CACHE_PREFIX: myCachePrefix
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "boilerplate": {
    "CACHE_PREFIX": "myCachePrefix"
  }
}
```
