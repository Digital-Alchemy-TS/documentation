---
name: ""
overview: ""
todos: []
isProject: false
---

# Core docs: new information architecture and full file tree

Current state: `docs/core/` is organized by **feature area** (configuration/, applications/, services/, testing/, libraries/, advanced/) with ~26 files. You want AppDaemon-style quality—lots of small examples, lots of notes—plus mermaid and embedded Monaco editors, and **significantly more**, **more granular** docs that feel **vastly different**.

Below is a **new information architecture** (by how people use docs: get started → learn → look up → go deep) and a **complete file tree** with every path. No preservation of the current top-level folders; content is rehomed into the new structure.

---

## Reality check: Gemini vs actual core source

Gemini’s suggestions are intent-based and narrative-first (good), but several assume APIs or concepts that **do not exist** in the core repo (`documentation/core/` = core library src). Document only what’s there.

**Use (and adapt):**

- **Conceptual roadmap** – Organize by intent (getting started → core concepts → module system → lifecycle → configuration → advanced → reference), not just API categories.
- **“Mental model” / execution narrative** – Explain the **real** bootstrap sequence and lifecycle so readers know “where their code runs.” Use the actual types and stage names from core.
- **Verbosity checklist** – For major concept pages: What is it? When does it happen? Why use it? How do I break it? (plus interactive sandbox where it helps.)
- **Mermaid** – For bootstrap/lifecycle sequence (real stages), dependency/wiring order (boilerplate → libraries in `buildSortOrder` order → application), and config flow (defaults → env/argv merge → file merge → validate). Use **real** names from source.
- **Monaco** – For TServiceParams “magic” (IntelliSense on `context.`), config schema → typed object, and “broken” examples (e.g. circular deps, missing provider) with an explanation of **why** TS/core complains.

**Do not document as first-class concepts:**

- **“The Registry”** – There is no public `Registry` type. Wiring is done via `WIRE_PROJECT`, `internal.boot.loadedModules` / `moduleMappings`, and `bootstrap()`. Document “wiring and the dependency graph” / “how bootstrap builds the context,” not a “Registry API.”
- **“Registry Reflection API”** – No API to query loaded modules at runtime. Omit.
- **“06-event-bus”** – `internal.utils.event` is a Node `EventEmitter` used internally (e.g. `EVENT_CONFIGURATION_UPDATED`). It is not a user-facing event bus. Do not add a top-level “Event Bus” section; at most a short “Internal events” note under advanced if needed.
- **“QuickConfigs” / “Module Settings”** – Not in core. Omit.
- **“Proxy system for circular deps”** – Circular dependencies are **forbidden**: `buildSortOrder()` throws `BootstrapException` with `BAD_SORT` (“Cannot find a next lib to load”). Document “no cycles; buildSortOrder enforces order and fails on cycles,” not a Proxy that “handles” them.
- **“PostInit”** – Wrong name. Real lifecycle stages are `PreInit`, `PostConfig`, `Bootstrap`, `Ready`, then shutdown: `PreShutdown`, `ShutdownStart`, `ShutdownComplete` (`helpers/lifecycle.mts`, `LIFECYCLE_STAGES`). Use these exact names everywhere.

**What actually exists (for narrative and diagrams):**

- **Bootstrap sequence** (`wiring.service.mts`): Create lifecycle → wire boilerplate → load config (LOAD_PROJECT) → wire libraries in `buildSortOrder` order → wire application → run lifecycle: `PreInit` → `PostConfig` → `Bootstrap` → `Ready`. Shutdown: `PreShutdown` → `ShutdownStart` → `ShutdownComplete`.
- **Lifecycle execution** (`lifecycle.service.mts`): Within each stage, callbacks run in priority order: positive (high→low), then no priority, then negative (high→low). `CreateLifecycle()`, `exec(stage)`.
- **Config** (`configuration.service.mts`, `config.mts`, `config-environment-loader.mts`, `config-file-loader.mts`): Definitions via `LOAD_PROJECT`; `ConfigLoaderSource` = `argv` | `env` | `file`. Load order: defaults from definitions, then env+argv merge, then file merge; `validateConfig()` runs (required checks). No single “Default → File → Env → CLI” pipeline; per-key `source` and merge order matter.
- **Dependency graph** (`wiring.mts` `buildSortOrder`): Libraries in dependency order; missing required dep → `MISSING_DEPENDENCY`; circular deps → `BAD_SORT`. No runtime “reflection” of the graph.

---

## Conceptual strategy (narrative + tools, grounded in core)

**Goal:** Explain the **runtime** and **state of the system**, not just API surface—so the docs feel authoritative like AppDaemon (philosophy + timing + pitfalls), using only concepts that exist in core.

**“The life of a service” (mental model):**

- **Discovery / wiring:** No “scanner” or decorators—modules are `CreateApplication` / `CreateLibrary`; services are plain functions. Wiring is `WIRE_PROJECT`: boilerplate → libraries in `buildSortOrder` order → application. Each step builds `internal.boot.loadedModules` and resolves `TServiceParams` for the next.
- **When does my code run?** Lifecycle: `PreInit` → `PostConfig` → `Bootstrap` → `Ready`. User code typically runs in lifecycle callbacks (`onReady`, etc.) or when a service is first invoked. Document this sequence with a **Mermaid sequence diagram** (real stage names, no “PostInit”).
- **Why injection?** Compare “global state / args dict” vs DA: `TServiceParams` is built from the dependency graph; `context.module_name` is typed via `LoadedModules`. One page (e.g. in core-concepts or guides): “Why dependency injection” with a short comparison.

**When to use which format:**

- **Mermaid:** Bootstrap/lifecycle **sequence** (PreInit → PostConfig → Bootstrap → Ready; shutdown the same). **Dependency graph** (root app → libraries in order → application; no cycles). **Config flow** (definitions → defaults → env/argv merge → file merge → validate). Use real type/stage names from core.
- **Monaco:** **TServiceParams** – show a service and typing `context.` to get IntelliSense (other services, config). **Config** – schema definition and resulting typed `config.`*. **“Broken” examples** – e.g. circular library deps (BAD_SORT), missing `LoadedModules` declaration, required config missing (REQUIRED_CONFIGURATION_MISSING); explain what the error means and where it comes from in core.
- **Notes/callouts:** Use for “When does this run?”, “Required config is validated at onPostConfig”, “Circular deps throw BAD_SORT”, “internal.event is for framework use only.”

**Verbosity checklist (per major concept page):**

1. **What is it?** (Definition, 1–2 sentences.)
2. **When does it happen?** (Place in bootstrap or lifecycle; link to lifecycle/reference.)
3. **Why should I use it?** (Best practice, when to prefer over alternatives.)
4. **How do I break it?** (Common errors: BAD_SORT, MISSING_DEPENDENCY, REQUIRED_CONFIGURATION_MISSING, invalid service definition; how to read the stack / context.)
5. **Interactive sandbox:** (Monaco example only where a runnable multi-file example adds value.)

---

## New top-level design


| Section         | Purpose                                                                                                                      | Count     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------- |
| **get-started** | Install, run first app, orient. Short.                                                                                       | 4 pages   |
| **tutorials**   | Numbered learning path. One idea per page, small example + notes, some with embedded editor.                                 | 12 pages  |
| **reference**   | Lookup. Substantive pages only—multiple sections per page; no one-paragraph stubs. Snippets + notes + editor where it helps. | ~35 pages |
| **guides**      | Deep dives. Mermaid + prose + optional embedded editor.                                                                      | 5 pages   |
| **advanced**    | Existing advanced content.                                                                                                   | 4 pages   |


**Total: ~60 core doc pages** (vs ~26 now). Every reference page must be substantive; one-paragraph stubs are not acceptable. Consolidate thin topics into multi-section pages (e.g. all config types in one `types.md`; all lifecycle hooks in one `hooks.md`).

---

## Full `docs/core/` tree

```
docs/core/
├── index.mdx
│
├── get-started/
│   ├── index.md
│   ├── install.md
│   ├── quickstart.mdx
│   └── next-steps.md
│
├── tutorials/
│   ├── index.md
│   ├── 01-first-application.md
│   ├── 02-configuration-basics.md
│   ├── 03-defining-a-service.md
│   ├── 04-service-returns.md
│   ├── 05-lifecycle-hooks.md
│   ├── 06-using-config-in-services.md
│   ├── 07-libraries.md
│   ├── 08-testing-basics.md
│   └── 09-what-next.md
│
├── reference/
│   ├── index.md
│   │
│   ├── application/
│   │   ├── applications.md             # CreateApplication, name, bootstrap, libraries array (multi-section)
│   │   └── bootstrap.md                # Bootstrap options, flow, when to use (substantive)
│   │
│   ├── config/
│   │   ├── defining.md
│   │   ├── types.md                    # All config types in one page: table + section per type (string, number, boolean, enum, string[], record)
│   │   ├── sourcing.md
│   │   └── using-in-services.md
│   │
│   ├── services/
│   │   ├── pattern.md
│   │   ├── service-params.md
│   │   ├── returns-object.md
│   │   ├── returns-function.md
│   │   ├── context.md
│   │   ├── priority-init.md
│   │   └── builtin/
│   │       ├── index.md
│   │       ├── logger.md               # Logger: API, streams, custom (one page, H2 per topic)
│   │       ├── scheduler.md
│   │       └── event.md
│   │
│   ├── libraries/
│   │   ├── create-library.md
│   │   └── dependencies.md
│   │
│   ├── testing/
│   │   ├── test-runner.md
│   │   ├── configuration-overrides.md
│   │   ├── test-lifecycle.md
│   │   └── module-replacements.md
│   │
│   └── lifecycle/
│       ├── overview.md                 # What lifecycle is, LIFECYCLE_STAGES, when stages run, link to hooks
│       └── hooks.md                    # One page: H2 per hook (onBootstrap, onPostConfig, onPreInit, onReady, onPreShutdown, onShutdownStart, onShutdownComplete) with 1–2 para + snippet each; execution order (priority within stage)
│
├── guides/
│   ├── index.md
│   ├── application-structure.md
│   ├── config-and-environment.md
│   ├── service-discovery.md
│   └── testing-strategies.md
│
└── advanced/
    ├── index.md
    ├── project-tuning.md
    ├── service-runner.md
    └── async-local-storage.md
```

**Removed as top-level**: `configuration/`, `applications/`, `services/`, `testing/`, `libraries/`, `install/`. Their content is moved into get-started (install), tutorials (learning path), reference/* (lookup), and guides (deep dives).

---

## Full `src/` tree (EmbeddedEditor + examples)

```
src/
├── components/
│   └── EmbeddedEditor/
│       ├── index.tsx
│       └── init.ts
│
└── examples/
    └── core/
        ├── get-started/
        │   └── quickstart.ts
        ├── tutorials/
        │   ├── first-application.ts
        │   ├── configuration-basics.ts
        │   ├── defining-a-service.ts
        │   ├── service-returns.ts
        │   ├── lifecycle-hooks.ts
        │   ├── using-config-in-services.ts
        │   ├── libraries.ts
        │   └── testing-basics.ts
        ├── reference/
        │   ├── create-application.ts
        │   ├── returns-object.ts
        │   ├── returns-function.ts
        │   ├── config-defining.ts
        │   ├── config-using.ts
        │   ├── test-runner.ts
        │   └── builtin/
        │       └── logger-api.ts
        ├── guides/
        │   ├── application-structure.ts
        │   ├── config-and-environment.ts
        │   └── testing-strategies.ts
        └── index-app.ts
```

**Convention**: Each `*.ts` exports `files: Record<string, string>` and optionally `defaultFile?: string`. MDX imports and passes to `<EmbeddedEditor files={files} defaultFile={defaultFile} />`. No example content in `init.ts`.

---

## Editor refactor (exact changes)

`**src/components/EmbeddedEditor/init.ts`**

- Remove `EXAMPLE_FILES`, `EXAMPLE_ROOT`, and any registration of example files.
- Keep: one-time Monaco compiler options, ATA setup.
- Add: `registerExampleFiles(monaco, virtualRoot: string, files: Record<string, string>)` — registers each entry as an extra lib under `virtualRoot` so multiple editor instances don’t share one virtual filesystem.

`**src/components/EmbeddedEditor/index.tsx`**

- Props: `files: Record<string, string>`, `defaultFile?: string` (default: first key of `files`).
- Derive file list and initial tab from props. On mount: call existing Monaco/ATA setup from init; call `registerExampleFiles(monaco, virtualRoot, files)` with a stable `virtualRoot` (e.g. from a new prop `exampleId?: string` or hash of doc path).
- Remove all imports/usages of `EXAMPLE_FILES` and `EXAMPLE_ROOT`.

`**docs/core/index.mdx`**

- Import `{ files, defaultFile }` from `@site/src/examples/core/index-app`.
- Render `<EmbeddedEditor files={files} defaultFile={defaultFile} />`.

---

## How current docs map into the new structure


| Current path                             | Becomes                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| core/index.mdx                           | core/index.mdx (hub only; editor uses index-app.ts)                                         |
| core/install/index.md                    | get-started/install.md (+ get-started/index.md, next-steps.md)                              |
| core/configuration/index.md              | reference/config/defining.md, types.md, using-in-services.md                                |
| core/configuration/sourcing.md           | reference/config/sourcing.md                                                                |
| core/applications/index.md, bootstrap.md | reference/application/*, tutorials/01-first-application.md, guides/application-structure.md |
| core/services/*                          | reference/services/*, tutorials/03–04, guides/service-discovery.md                          |
| core/libraries/index.md                  | reference/libraries/*, tutorials/07                                                         |
| core/testing/*                           | reference/testing/*, tutorials/08, guides/testing-strategies.md                             |
| core/advanced/*                          | advanced/* unchanged                                                                        |


---

## Content conventions per section

- **get-started**: Short. quickstart.mdx has one embedded editor (quickstart.ts).
- **tutorials**: One main idea per page. 2–4 short code blocks or one embedded editor, 1–3 callouts (Note/Tip/Warning). No mermaid unless one diagram per tutorial.
- **reference**: Substantive pages only. Multiple sections or a table + subsections per page; brief description, code examples, notes. Add embedded editor where a multi-file runnable example helps (e.g. create-application, returns-object, test-runner).
- **guides**: Mermaid diagram(s) + prose + optional embedded editor. One guide = one deep topic (application structure, config and env, service discovery, testing strategies).
- **advanced**: Keep current style.

---

## Sidebar

`sidebars.ts` will need to reflect the new top-level: get-started, tutorials (numbered), reference (grouped by application/config/services/libraries/testing/lifecycle), guides, advanced. Either autogenerate from the tree above or hand-maintain the order.

---

## Alternative: intent-based numbered folders (optional)

If you prefer Gemini-style “organize by intent” with numbered top-level sections (and no event-bus), you can flatten to:

```
docs/core/
├── index.mdx
├── 01-getting-started/
│   ├── overview.md
│   ├── installation.md
│   └── your-first-module.mdx          # Hello World + embedded editor
├── 02-core-concepts/
│   ├── wiring-and-dependency-graph.md # How bootstrap builds context; buildSortOrder; no "Registry"
│   ├── dependency-injection.md        # Why DI; TServiceParams vs global
│   └── bootstrapping.md               # main → PreInit → PostConfig → Bootstrap → Ready (real stages)
├── 03-module-system/
│   ├── defining-modules.md            # CreateLibrary, CreateApplication
│   ├── dependency-graph.md            # libraries array, buildSortOrder, BAD_SORT on cycles
│   └── service-wiring.md             # How TServiceParams is built; LoadedModules
├── 04-lifecycle/
│   ├── hooks-overview.md             # TLifecycleBase, LIFECYCLE_STAGES
│   └── execution-order.md            # Priority within stage; Mermaid sequence
├── 05-configuration/
│   ├── type-safe-config.md           # Defining schemas (BaseConfig, types)
│   ├── sources.md                    # ConfigLoaderSource: argv, env, file; merge order
│   └── validation.md                 # required; validateConfig at onPostConfig
├── 06-advanced/
│   ├── logging.md
│   ├── testing-framework.md          # TestRunner, mocks, lifecycle
│   ├── service-runner.md
│   └── async-local-storage.md
└── 07-api-reference/                 # One concept per page; same content as reference/ in main tree
    └── ... (application, config, services, libraries, testing, lifecycle)
```

No `06-event-bus`: internal event emitter is not a user-facing concept. Use “Reality check” and “Conceptual strategy” above so any new pages (e.g. flowcharts) only describe real behavior from core.

---

## Home automation (later)

Same architecture: get-started | tutorials | reference (many small pages) | guides | advanced. `src/examples/home-automation/` mirrors that. Not expanded here.
