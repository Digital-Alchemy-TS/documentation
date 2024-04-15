---
aliases:
  - Terminal
---
## Description

Welcome to `@digital-alchemy/terminal`!

> **Warning**:
> These docs are very WIP, and will be improved over time

## 💾 Install

Add as a dependency, and add to your imports. Nice and easy
```bash
npm i @digital-alchemy/terminal
```
**Add to code**
```typescript
import { LIB_TERMINAL } from "@digital-alchemy/terminal";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_TERMINAL],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_TERMINAL],
  name: "special_logic",
})
```
> 🎉
> Listing as an import will automatically load into [LoadedModules](/core/exports/LoadedModules) and make the library features available as `synapse` on [TServiceParams](/core/exports/TServiceParams).

## Exports

### Components

| Name               | Description |
| ------------------ | ----------- |
| [Acknowledge](/terminal/components/acknowledge)    |             |
| [Array Builder](/terminal/components/array-builder)  |             |
| [Confirm](/terminal/components/confirm)        |             |
| [Menu](/terminal/components/menu)           |             |
| [Object Builder](/terminal/components/object-builder) |             |
| [Pick Many](/terminal/components/pick-many)      |             |
### Editors

| Name       | Description |
| ---------- | ----------- |
| [Date](/terminal/editors/date)   |             |
| [Number](/terminal/editors/number) |             |
| [String](/terminal/editors/string) |             |
### Support Code

| Name                    | Description |
| ----------------------- | ----------- |
| [Ansi Functions](/terminal/ansi-functions)      |             |
| [Application Manager](/terminal/application-manager) |             |
| [Colors](/terminal/colors)              |             |
| [Comparison Tools](/terminal/comparison-tools)    |             |
| [Environment](/terminal/environment)         |             |
| [Form](/terminal/form)                |             |
| [Icons](/terminal/icons)               |             |
| [Internals](/terminal/internals)           |             |
| [Keyboard Manager](/terminal/keyboard-manager)    |             |
| [Keymap](/terminal/keymap)              |             |
| [Prompts](/terminal/prompts)             |             |
| [Registry](/terminal/registry)            |             |
| [Screen](/terminal/screen)              |             |
| [Table](/terminal/table)               |             |
| [Text Rendering](/terminal/text-rendering)      |             |
