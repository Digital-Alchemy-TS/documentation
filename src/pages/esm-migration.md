---
title: 💥 ESM Migration Guide
---

# 💥 ESM Migration Guide

As part of a recent major upgrade to `@digital-alchemy/core`, the library internals have been migrated from a `commonjs` module format to `esmodule`.
This presents as a breaking change to the way the Quickstart projects were initially put together.

The quickstart projects have since been patched to be compatible, but individual projects will require migrations.

## 🎯 Objectives

The goal of this guide is to add `ESM` compatibility to an existing repo, and to pull ALL dependencies in your workspace up to their latest versions.

## 🏗️ Steps

> ⚠️ Make sure to commit your code before starting on this!

### **1)** Update Dependencies

You can use `yarn` to upgrade all of your package dependencies to their latest version.

```bash
$ yarn upgrade-interactive
```

The command will present you a list of dependencies that can be updated, as well as potential upgrade targets.
Unless you have introduced additional package dependencies in to your workspace, you should upgrade everything to the highest available version (furthest to the right).

### **2)** Build Fixing

#### `package.json`

Add this line to your package file

```json
{
  "type": "module",

... rest of package file
```

If you have `type-writer` installed, your `scripts` will also need to be updated -

```json
  "scripts": {
    // before
    "type-writer": "type-writer",

    // after
    "type-writer": "npx type-writer",
  }
```

#### `tsconfig.json`

> [Reference file](https://raw.githubusercontent.com/Digital-Alchemy-TS/haos-template/refs/heads/main/tsconfig.json)

Ensure these properties are set to the below values.

```json
"lib": ["ESNext"],
"module": "ESNext",
"moduleResolution": "Bundler",
```

### **3)** ESLint Fixes

A manual migration to `eslint9` is relatively straightforward.

```bash
$ npx @eslint/migrate-config .eslintrc.json
```

Most of this process is automated, and it will ask you to install some additional dependencies as part of it's own output

```bash
$ yarn add -D @eslint/compat globals @eslint/js @eslint/eslintrc
```

When complete, you will have a new `eslint.config.mjs` file in the root of your repo.
At this point you should delete the existing `.eslintrc` & `.eslintignore` files (or similarly named) that are in your project.

### **4)** Workspace Fixes

Time to start fixing all of the brand new workspace errors that just started showing up.
To get started, update your types for `hass` again.

```bash
$ yarn type-writer
```

#### Build Fixing

You can do a quick check to make sure that everything builds as expected.

```typescript
$ yarn typecheck
```

or

```typescript
$ npx tsc --skipLibCheck --noEmit
```

#### Lint Fixes

Depending on the plugins you have loaded, you may discover that there are many new rules active.
If you have one that outright does not work (frequent w/ `sonarjs` for example), you can disable the individual rule in your config as normal.

```bash
$ yarn lint
```

> Example central rule disabling

```json
{
  ...
  "rules": {
    "something/misbehaving-rule": "off"
  }
  ...
}
```
