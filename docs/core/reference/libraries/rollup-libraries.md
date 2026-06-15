---
title: RollupLibraries
sidebar_position: 2
description: "RollupLibraries() — compose libraries into a nameless, deduped membership unit, and the LoadedRollups type channel."
---

`RollupLibraries` composes several libraries into a single, **nameless** membership unit. List it anywhere a library list is accepted — `CreateApplication({ libraries })` or a library's `implies` — and at bootstrap it flattens into its members and dedupes.

```typescript
import { RollupLibraries, CreateApplication } from "@digital-alchemy/core";

const analyticsPlugin = RollupLibraries(
  [ANALYTICS_INGEST, ANALYTICS_API, ANALYTICS_STORE],
  { label: "analytics" },
);

CreateApplication({
  name: "platform",
  libraries: [analyticsPlugin, billingPlugin, SHARED_DB], // rollups + plain libs, freely mixed
  services: { ... },
});
```

## Why

The application `libraries` array must be a **complete, flat** enumeration of every library plus its transitive dependencies (`buildSortOrder` throws `MISSING_DEPENDENCY` for any `depends` target that is absent). For a large app organized into plugin-like groups, hand-maintaining that union is error-prone and loses any record of *which group contributed what*.

`RollupLibraries` makes "these N libraries are one composable unit" a first-class, typed, deduped, introspectable value.

## Signature

```typescript
function RollupLibraries<const M extends readonly RollupMember[]>(
  members: M,
  options?: { label?: string },
): LibraryRollup<M>;
```

| Param | Type | Description |
|---|---|---|
| `members` | `(LibraryDefinition \| LibraryRollup)[]` | Libraries and/or nested rollups to compose |
| `options.label` | `string` | Optional diagnostic label for the boot manifest — **not** a DI identity |

## Semantics

- **Membership only.** A rollup contributes membership; it is nameless, gets **no `LoadedModules` key**, and adds **no ordering edge**. Ordering stays entirely on each member's own `depends`, topologically sorted as always.
- **Dedup by object identity.** The same singleton library reached through multiple rollups (or `implies`) collapses to one entry. This requires members to be **module-singleton exports** referenced by the rollups — not constructed inline per rollup.
- **Nested rollups flatten recursively.**
- **Same name, different object → error.** Two distinct objects sharing a name survive flattening and are then rejected by the standard duplicate-name guard (`DUPLICATE_LIBRARY`).
- **Cycle detection.** A rollup that transitively contains itself throws `COMPOSITION_CYCLE`.
- **Multi-path hygiene warning.** When a library enters membership via more than one path (a diamond), boot emits an informational `warn` — consider declaring it a shared base dependency. With `showExtraBootStats`, the boot manifest lists each member and the path(s) that contributed it.

```typescript
// member's own depends still orders it correctly, regardless of how membership arrived
const ANALYTICS_STORE = CreateLibrary({
  name: "analytics_store",
  depends: [SHARED_DB], // SHARED_DB wires first — even if both came via the rollup
  services: { ... },
});
```

## Typing: the `LoadedRollups` channel

`TServiceParams` is keyed off the global `LoadedModules` interface, which each library augments via declaration merging. A rollup is nameless and registers **no** `LoadedModules` key — so for a consumer that imports **only the rollup** (e.g. across a published-package boundary), the members' APIs would not otherwise appear on `TServiceParams`.

To make them visible, register the rollup's members on the **`LoadedRollups`** channel in the module that defines the rollup:

```typescript title="analytics/src/index.mts"
export const analyticsPlugin = RollupLibraries(
  [ANALYTICS_INGEST, ANALYTICS_API],
  { label: "analytics" },
);

declare module "@digital-alchemy/core" {
  export interface LoadedRollups {
    analytics: {
      analytics_ingest: typeof ANALYTICS_INGEST;
      analytics_api: typeof ANALYTICS_API;
    };
  }
}
```

The member shapes are inlined into this augmentation, which travels with the rollup import — so `params.analytics_ingest` and `params.analytics_api` are fully typed downstream. See [Library composition](../../guides/library-composition) for the full explanation of *why* this is required.

:::note Membership-only consequence
A library delivered **only** through a rollup gets its service APIs on `TServiceParams`, but — because it has no `LoadedModules` key — no typed `config.<member>` entry and no `levelOverrides` entry. Its runtime config still loads. If you need typed config, also list the library directly (or have it augment `LoadedModules` itself).
:::

## Validation errors

| Error cause | What it means |
|---|---|
| `COMPOSITION_CYCLE` | A rollup transitively contains itself, or an `implies` chain forms a cycle |
| `DUPLICATE_LIBRARY` | Two different objects sharing a name reached membership (e.g. via a rollup and directly) |

## Related

- [CreateLibrary](./create-library) — the `implies` field is the other feed into the same membership resolver
- [Dependency Graph](./dependency-graph) — ordering, which rollups leave untouched
- [Library composition](../../guides/library-composition) — guide: membership vs ordering, and cross-package typing
