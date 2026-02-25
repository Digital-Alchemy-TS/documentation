---
title: Installation
sidebar_position: 2
description: "Install DA Core, runtime requirements, and tsconfig setup."
---

## Install

```bash
npm install @digital-alchemy/core
# or
yarn add @digital-alchemy/core
# or
bun add @digital-alchemy/core
```

No additional peer dependencies are required for the core package alone.

## Runtime requirements

| Runtime | Minimum version |
|---|---|
| Node.js | 20 |
| Bun | 1.0 |
| Deno | 1.40 (with Node compat mode) |
| tsx | any current |

The framework uses `AsyncLocalStorage` and `EventEmitter` from Node's standard library. Both are available in all supported runtimes.

## TypeScript configuration

DA Core relies on module resolution features available in TypeScript 5+ with `NodeNext` (or `Bundler`) module settings. Your `tsconfig.json` must include:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true
  }
}
```

If you use `.mts` files (recommended for ESM projects), also ensure your `package.json` has:

```json
{
  "type": "module"
}
```

:::tip
Using `.mts` extensions for source files and `.mjs` for outputs is the most reliable path for ESM in Node 20+. The framework itself is published as ESM, so a CommonJS-only project will require a bundler or interop shim.
:::

## Common setup errors

**`ERR_REQUIRE_ESM`** — You're importing an ESM package from a CJS module. Set `"type": "module"` in `package.json` and use `.mts` extensions.

**`Cannot find module '@digital-alchemy/core'`** — TypeScript cannot resolve the package. Check that `moduleResolution` is `NodeNext` or `Bundler`, not `Node` (legacy).

**`Type 'X' is not assignable to type 'Y'`** on `TServiceParams` — Usually means `target` is set below `ES2022`. Async iterators, `Object.hasOwn`, and other features used internally require ES2022 output.

## Next step

[Quickstart →](./quickstart.mdx)
