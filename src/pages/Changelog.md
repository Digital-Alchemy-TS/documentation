> [!summary]
> #Changelog for the higher level project
> - 🐛 Bugs
>  - 🛠 Maintenance
>  - 📑 Documentation
>  - 📈 Improvement

# 0.x
- [Prioritized backlog · Home Automation](https://github.com/orgs/Digital-Alchemy-TS/projects/1)
- [Prioritized backlog · Side Projects](https://github.com/orgs/Digital-Alchemy-TS/projects/2)

Internally, the library coordinates all breaking changes around minor version bumps. These have traditionally mainly been driven by breaking changes that would prevent a perfect in place upgrade.

There is an internal feature set target for `1.0` (which includes adding unit tests), after which versioning will use the major version for breaking changes.

### 0.3.x

> [!faq] Breaking changes with previous
> - Breaking restructure of [Internal](/core/internal) to a more final structure,
> - Removal of legacy global variables that caused issues when multiple versions of the core were loaded (through node_modules and npm link flows)

Github org created, build out of documentation, initial public releases.

### 0.2.x
> [!faq] Breaking changes with previous:
> - Breaking down the monorepo approach for many smaller / independant repos under a shared namespace

Short lived minor, mostly focused on code cleanup efforts.

### 0.1.x
> [!faq] Breaking changes with previous:
> - Namespace change -> `@digital-alchemy`

Focused on code upgrades from initial usability testing and closing the functionality gap with legacy codebase

### 0.0.x
> [!faq] Breaking changes with previous:
> - Dropped class / nestjs based approach for a full custom bootstrap + functional approach
Building out core library based on proof of concept work

---

> [!missing]
> The previous major project versions are prototypes in a separate code base
