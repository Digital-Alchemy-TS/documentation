---
title: LibraryGroup
sidebar_position: 2
description: "LibraryGroup() — compose libraries into a membership unit, with optional name, registry service, and the LoadedRollups type channel."
---

`LibraryGroup` composes several libraries into a membership unit. List it anywhere a library list is accepted — `CreateApplication({ libraries })` or a library's `implies` — and at bootstrap it flattens into its members and dedupes.

```typescript
import { LibraryGroup, CreateApplication } from "@digital-alchemy/core";

const analyticsPlugin = LibraryGroup({
  members: [ANALYTICS_INGEST, ANALYTICS_API, ANALYTICS_STORE],
  name: "analytics",
});

CreateApplication({
  name: "platform",
  libraries: [analyticsPlugin, billingPlugin, SHARED_DB], // groups + plain libs, freely mixed
  services: { ... },
});
```

## Why

The application `libraries` array must resolve to a **complete** enumeration of every library. With closure-as-membership (`depends` transitively pulling dependencies into the wired set), most transitive libraries are auto-pulled — but explicit groups are still the right tool when you want to name, bundle, or provide a registry for a plugin-like collection.

`LibraryGroup` makes "these N libraries are one composable unit" a first-class, typed, deduped, introspectable value.

## Signature

```typescript
function LibraryGroup<const M extends readonly RollupMember[]>({
  members,
  name,
  registry,
}: {
  members: M;
  name?: string;
  registry?: string;
}): LibraryRollup<M>;
```

| Param | Type | Description |
|---|---|---|
| `members` | `(LibraryDefinition \| LibraryGroup)[]` | Libraries and/or nested groups to compose |
| `name` | `string` | Optional group name — earns a `LoadedModules` key and reserves a `config.<name>` namespace |
| `registry` | `string` | Optional registry-service name — requires `name`; generates a `priorityInit` registry service |

## Semantics

- **Membership only.** A group contributes membership; it adds **no ordering edge**. Ordering stays entirely on each member's own `depends`, topologically sorted as always.
- **Named group.** When `name` is provided, the group earns a `LoadedModules` key and a reserved `config.<name>` namespace. Useful when the group itself should be introspectable or when consumers need a named config block.
- **Dedup by object identity.** The same singleton library reached through multiple groups (or `implies` or `depends` closure) collapses to one entry.
- **Nested groups flatten recursively.**
- **Same name, different object → error.** Two distinct objects sharing a name survive flattening and are rejected by the duplicate-name guard (`DUPLICATE_LIBRARY`) — the error names both copies and points at `yarn dedupe`.
- **Cycle detection.** A group that transitively contains itself throws `COMPOSITION_CYCLE`.
- **Multi-path hygiene warning.** When a library enters membership via more than one path (a diamond), boot emits an informational `warn`. With `showExtraBootStats`, the boot manifest lists each member and the path(s) that contributed it.

## `registry` — the plugin-registry pattern

When `registry` is provided (requires `name`), `LibraryGroup` synthesizes a **carrier library** that hosts a `priorityInit` registry service. Each member is shallow-cloned with `depends: [carrier]` appended so the registry is always wired before any member reads it.

The generated service exposes `register(item)` / `list()`:

```typescript
export const ANALYTICS_GROUP = LibraryGroup({
  name: "analytics",
  registry: "registry",
  members: [ANALYTICS_INGEST, ANALYTICS_API],
});
```

Members self-register using `lifecycle.onPreInit` (not at module scope, not in `onBootstrap`):

```typescript title="analytics-ingest.service.mts"
export function IngestService({ analytics, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    analytics.registry.register({ name: "ingest", fetch: ingestImpl });
  });
  // ...
}
```

Consumers read the registry after boot:

```typescript
export function RouterService({ analytics }: TServiceParams) {
  const adapters = analytics.registry.list();
}
```

```typescript
// member's own depends still orders it correctly, regardless of how membership arrived
const ANALYTICS_STORE = CreateLibrary({
  name: "analytics_store",
  depends: [SHARED_DB], // SHARED_DB wires first — even if both came via the group
  services: { ... },
});
```

## Typing: the `LoadedRollups` channel

`TServiceParams` is keyed off the global `LoadedModules` interface, which each library augments via declaration merging. A group with no name registers **no** `LoadedModules` key — so for a consumer that imports **only the group** (e.g. across a published-package boundary), the members' APIs would not otherwise appear on `TServiceParams`.

To make them visible, register the group's members on the **`LoadedRollups`** channel in the module that defines the group:

```typescript title="analytics/src/index.mts"
export const analyticsPlugin = LibraryGroup({
  name: "analytics",
  members: [ANALYTICS_INGEST, ANALYTICS_API],
});

declare module "@digital-alchemy/core" {
  export interface LoadedRollups {
    analytics: {
      analytics_ingest: typeof ANALYTICS_INGEST;
      analytics_api: typeof ANALYTICS_API;
    };
  }
}
```

The member shapes are inlined into this augmentation, which travels with the group import — so `params.analytics_ingest` and `params.analytics_api` are fully typed downstream. See [Library composition](../../guides/library-composition) for the full explanation of *why* this is required.

:::note Type priority
`LoadedRollups` is a **fallback** channel. Directly-listed library augmentations always win. `LoadedRollups` only fills keys not already present from a direct `LoadedModules` augmentation.
:::

:::note Membership-only consequence
A library delivered **only** through an unnamed group gets its service APIs on `TServiceParams`, but — because it has no `LoadedModules` key — no typed `config.<member>` entry and no `levelOverrides` entry. Its runtime config still loads. If you need typed config, also list the library directly.
:::

## Validation errors

| Error cause | What it means |
|---|---|
| `COMPOSITION_CYCLE` | A group transitively contains itself, or an `implies`/`depends` chain forms a cycle |
| `DUPLICATE_LIBRARY` | Two different objects sharing a name reached membership — likely two physical copies installed; run `yarn dedupe` |
| `REGISTRY_REQUIRES_NAME` | `registry` was provided without a `name` |

## Related

- [CreateLibrary](./create-library) — the `implies` and `depends` fields are the other feeds into the same membership resolver
- [Dependency Graph](./dependency-graph) — ordering, which groups leave untouched
- [Library composition](../../guides/library-composition) — guide: membership vs ordering, and cross-package typing
