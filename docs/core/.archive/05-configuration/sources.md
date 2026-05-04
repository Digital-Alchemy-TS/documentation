---
title: Sources
sidebar_position: 4
description: "Where configuration values come from and the merge order."
---

Configuration values can come from multiple sources. The priority order, from lowest to highest:

1. **Definition defaults** — `default:` in the module's config definition
2. **Bootstrap overrides** — values passed directly to `bootstrap({ configuration: { ... } })`
3. **Environment variables** — from the process environment or `.env` files
4. **CLI arguments** — `--KEY value` or `--KEY=value`
5. **Config files** — `.json`, `.yaml`, or `.ini` files

Later sources win. A CLI argument overrides an env var; an env var overrides a bootstrap override; a bootstrap override overrides the default.

## Environment variables

Case-insensitive; `-` and `_` are interchangeable. The following are all equivalent for a config key `CACHE_PROVIDER`:

```bash
CACHE_PROVIDER=redis tsx main.mts
cache-provider=redis tsx main.mts
CACHE_PROVIDER=redis tsx main.mts
```

### .env files

The framework automatically loads `.env` files using [@dotenvx/dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx), which supports encrypted secrets. Load order:

1. `--env-file ./path` from CLI
2. `envFile` option in bootstrap
3. `.env` in the current working directory

```bash
tsx main.mts --env-file ./production.env
```

## CLI arguments

```bash
tsx main.mts --PORT=4000
tsx main.mts --PORT 4000
tsx main.mts --FEATURE_FLAG         # boolean true
```

Use `--config ./path` to point to a config file:

```bash
tsx main.mts --config ./config/dev.yaml
```

## Config files

Supported formats: `json`, `yaml`, `ini`. The file loader searches these paths (in order):

- `/etc/{app_name}` (Linux/macOS only)
- `.{app_name}` in the current directory
- `.{app_name}` recursively up the directory tree
- `~/.config/{app_name}`

Extensions checked per path: auto-detect → `.json` → `.ini` → `.yaml` → `.yml`

Auto-detect attempts JSON first, then YAML, then falls back to INI.

## Bootstrap overrides

Values passed to `bootstrap()` have higher priority than defaults but lower priority than env/CLI/files. Use them for environment-specific values set at the entrypoint level:

```typescript
await MY_APP.bootstrap({
  configuration: {
    boilerplate: { LOG_LEVEL: "debug" },
    my_app: { API_URL: "https://staging.example.com" },
  },
});
```

## Disabling sources

For testing or constrained environments, you can disable specific loaders:

```typescript
await MY_APP.bootstrap({
  configSources: {
    env: false,
    file: false,
    // argv: true (default)
  },
});
```
