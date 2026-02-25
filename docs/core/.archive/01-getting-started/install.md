---
title: Installation
sidebar_position: 2
description: "How to install Digital Alchemy Core and configure your project."
---

## Requirements

- **Node.js** ≥ 18 (or Bun / Deno — see [Runtimes](#runtimes) below)
- **TypeScript** — the framework is ESM-first and written entirely in TypeScript

## Install

```bash
# yarn
yarn add @digital-alchemy/core

# npm
npm install @digital-alchemy/core

# bun
bun add @digital-alchemy/core
```

## TypeScript configuration

Digital Alchemy uses `.mts` file extensions and ES modules throughout. Your `tsconfig.json` should target at least ES2022 and use `NodeNext` or `Bundler` module resolution:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true
  }
}
```

:::tip
If you use Bun or a bundler, `"module": "ESNext"` and `"moduleResolution": "Bundler"` also work.
:::

## Runtimes

Digital Alchemy is runtime-agnostic. Your entrypoint file (`main.mts`) runs the same regardless of how you execute it:

```bash
# tsx (TypeScript execute — fast local dev)
npx tsx src/main.mts

# ts-node
npx ts-node --esm src/main.mts

# Bun
bun run src/main.mts

# Compiled Node.js
tsc && node dist/main.js
```

For production, building with `tsc` and running with plain `node` is the most portable option. For development, [`tsx`](https://github.com/esbuild-kit/tsx) reloads quickly with no build step.

## Day.js plugins

Digital Alchemy uses [Day.js](https://day.js.org/) for date/time utilities and requires a few non-default plugins. If your editor shows missing types for Day.js methods, add this somewhere in your project (e.g. a `dayjs-setup.mts` imported by your entrypoint):

```typescript
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import isBetween from "dayjs/plugin/isBetween.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
```

This is a one-time setup. After it runs, `dayjs.duration(...)`, `dayjs().isBetween(...)`, and `dayjs().week()` will all type-check correctly.
