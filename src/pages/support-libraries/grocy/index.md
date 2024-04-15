---
aliases:
  - Grocy
---
## Description

> https://grocy.info/
> Grocy is a web-based self-hosted groceries & household management solution for your home.

- [Changelog](/support-libraries/grocy/changelog/0.3.x)

API adapters for the Grocy application. Contains basic adapters for:
- `Battery`
- `Chores`
- `Objects`
- `Recipe`
- `Stock`
- `System`
- `Tasks`
- `User`

## Project State

Adapters aren't yet fully built out yet. Current aim for the project is to provide monitoring and updates for `chores`, `batteries`, and `tasks`.

A specialized aggregator service will poll Grocy for changes, and will gather information about the current "to do" list
