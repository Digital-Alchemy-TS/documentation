---
title: 💥 ESM Migration Guide (part 2)
---

# 💥 ESM Migration Guide (pt2)

This guide is the follow up to the [part 1 esm migration](./esm-migration.md).

The motivation for the changes leading up to this guide are from the standards being pushed by nodejs with regard to the format of ESM Modules

- https://nodejs.org/api/esm.html#mandatory-file-extensions

> **TLDR:** import statements need file extensions

Typescript support for this feature is part of the **Typescript 5.7** beta.
If you want to stick to `5.6` (current at time of writing), the only difference with this guide is import statements need `.mjs` instead of `.mts`

- https://devblogs.microsoft.com/typescript/announcing-typescript-5-7-beta/#path-rewriting-for-relative-paths

```typescript
// before
import { ExampleService } from "./example-file";
import { ExampleService } from "./folder";

// after Typescript 5.7
import { ExampleService } from "./example-file.mts";
import { ExampleService } from "./folder/index.mts";

// after Typescript 5.6
import { ExampleService } from "./example-file.mjs";
import { ExampleService } from "./folder/index.mjs";
```

## ⛑️ Performing the migration

With the way `@digital-alchemy` works, it's totally expected to see lots of angry red errors from your code until the process is complete.
Your application code **SHOULD NOT** need changes from this migration.

### Update file patterns

A few files need their file patterns updated to properly make the changes lower work.

- `tsconfig.json`
- `eslint.config.mjs`
- `package.json`

The basic update is the same for all the files: find and replace `.ts` to `.mts`

### Typescript 5.7 config

Add this option to your `tsconfig`

```json
"rewriteRelativeImportExtensions": true,
```

#### Using beta

Manually update to 5.7 beta in `package.json`

```json
"typescript": "5.7.0-beta",
```

Make sure you are using the workspace installed version of typescript.

![vscode](/img/ts-version.png)

### Update code

You can quickly rename all files in place with this shell command

```bash
# do this from inside src folder, not root
cd /path/to/src

# replace change file.ts -> file.mts, recurse into all subfolders
find . -type f -name "*.ts" -exec bash -c 'mv "$0" "${0%.ts}.mts"' {} \;
```

Next is the annoying part of the migration - manually updating all the imports at the top of files.
Adding `.mts` to the end of files and `/index.mts` to the end of directory imports.

## 🔍 Unit tests

If you are using `jest` to test your automations, it is recommended to move over to `vitest`.
It has improved esm compatibility, and shares the same testing interface.

```bash
yarn add -D vitest
```

Create file: `vitest.config.ts`

```typescript
import "vitest/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["html", "lcov", "clover"],
    },
  },
});
```

Add to `compilerOptions` in your tsconfig.

```json
"types": ["vitest/globals"],
```

Replace `test` command in your `package.json`

> If you experience intermittent test failures, try disabling parallel tests

```json
"test": "vitest",
// or
"test": "vitest --no-file-parallelism",
```
