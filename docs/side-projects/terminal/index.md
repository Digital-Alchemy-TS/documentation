---
title: Terminal
---
## Description

Welcome to `@digital-alchemy/terminal`!

> **Warning**:
> These docs are very WIP, and will be improved over time

- [Changelog](/docs/side-projects/terminal//changelog/0.3.x)

## 💾 Install

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/terminal
```

> **Add to code**

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
> Listing as an import will automatically load into `LoadedModules` and make the library features available as `terminal` on `TServiceParams`.

## Exports

### Components

| Name                                                  | Description |
| ----------------------------------------------------- | ----------- |
| [Acknowledge](/docs/side-projects/terminal//components/acknowledge)       |             |
| [Array Builder](/docs/side-projects/terminal//components/array-builder)   |             |
| [Confirm](/docs/side-projects/terminal//components/confirm)               |             |
| [Menu](/docs/side-projects/terminal//components/menu)                     |             |
| [Object Builder](/docs/side-projects/terminal//components/object-builder) |             |
| [Pick Many](/docs/side-projects/terminal//components/pick-many)           |             |

### Editors

| Name                               | Description |
| ---------------------------------- | ----------- |
| [Date](/docs/side-projects/terminal//editors/date)     |             |
| [Number](/docs/side-projects/terminal//editors/number) |             |
| [String](/docs/side-projects/terminal//editors/string) |             |

### Support Code

| Name                                                 | Description |
| ---------------------------------------------------- | ----------- |
| [Ansi Functions](/docs/side-projects/terminal//ansi-functions)           |             |
| [Application Manager](/docs/side-projects/terminal//application-manager) |             |
| [Colors](/docs/side-projects/terminal//colors)                           |             |
| [Comparison Tools](/docs/side-projects/terminal//comparison-tools)       |             |
| [Environment](/docs/side-projects/terminal//environment)                 |             |
| [Form](/docs/side-projects/terminal//form)                               |             |
| [Icons](/docs/side-projects/terminal//icons)                             |             |
| [Internals](/docs/side-projects/terminal//internals)                     |             |
| [Keyboard Manager](/docs/side-projects/terminal//keyboard-manager)       |             |
| [Keymap](/docs/side-projects/terminal//keymap)                           |             |
| [Prompts](/docs/side-projects/terminal//prompts)                         |             |
| [Registry](/docs/side-projects/terminal//registry)                       |             |
| [Screen](/docs/side-projects/terminal//screen)                           |             |
| [Table](/docs/side-projects/terminal//table)                             |             |
| [Text Rendering](/docs/side-projects/terminal//text-rendering)           |             |
