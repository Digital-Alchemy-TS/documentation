---
aliases:
  - Terminal
---
## Description

Welcome to `@digital-alchemy/terminal`! 

> [!warning]
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
> [!success]
> Listing as an import will automatically load into [[LoadedModules]] and make the library features available as `synapse` on [[TServiceParams]].

## Exports

### Components

| Name               | Description |
| ------------------ | ----------- |
| [[Acknowledge]]    |             |
| [[Array Builder]]  |             |
| [[Confirm]]        |             |
| [[Menu]]           |             |
| [[Object Builder]] |             |
| [[Pick Many]]      |             |
### Editors

| Name       | Description |
| ---------- | ----------- |
| [[Date]]   |             |
| [[Number]] |             |
| [[String]] |             |
### Support Code

| Name                    | Description |
| ----------------------- | ----------- |
| [[Ansi Functions]]      |             |
| [[Application Manager]] |             |
| [[Colors]]              |             |
| [[Comparison Tools]]    |             |
| [[Environment]]         |             |
| [[Form]]                |             |
| [[Icons]]               |             |
| [[Internals]]           |             |
| [[Keyboard Manager]]    |             |
| [[Keymap]]              |             |
| [[Prompts]]             |             |
| [[Registry]]            |             |
| [[Screen]]              |             |
| [[Table]]               |             |
| [[Text Rendering]]      |             |