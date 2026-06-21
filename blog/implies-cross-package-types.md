---
title: "Composing libraries without a type black hole: LibraryGroup, implies, and the circular dependency I had to *not* solve"
date: 2026-06-16
description: "Opt-in composition primitives for Digital Alchemy, the wire-time snapshot that makes membership and ordering different problems, and why surfacing implied types automatically meant doing less, not more."
---

Once a Digital Alchemy app grows past a handful of libraries, the `libraries` array stops being a list and becomes a chore. Each plugin-like group is itself several libraries, and the application has to name every one of them, plus every transitive dependency, in one flat array. Miss one and boot throws `MISSING_DEPENDENCY`. It works, but you're hand-maintaining a dependency graph that the libraries already know.

So core now has opt-in primitives for composing that list — and getting them to carry types across a package boundary led me straight into a circular dependency I deliberately left unsolved. That second part is the interesting one.

<!--truncate-->

## Two axes nobody tells you are separate

Bootstrapping needs two different things from you, and they're orthogonal:

- **Membership** — *which* libraries exist. That's the application's `libraries` array. It has to be complete and flat.
- **Ordering** — *what wires before what*. Topologically sorted from each library's own `depends` / `optionalDepends`.

Keeping the two apart is what lets the off-diagonal cases exist at all: a library you want *present but unordered*, or *ordered-if-present but never forced into membership*. `depends` is the common case that answers both at once — it declares an ordering edge **and** pulls its target (transitively) into membership, carrying its types along. The other primitives are what you reach for when you want exactly one axis and not the other.

## Composition: `LibraryGroup`, `depends`, and `implies`

There are two shapes of composition: a standalone value you assemble and reuse, or a field you set on a library you're already authoring.

| | `LibraryGroup` | `depends` / `implies` |
|---|---|---|
| What it is | A standalone composition value | Fields on a **named** library |
| Use when | You want to bundle N libraries as a reusable unit | Loading library X should always bring Y, Z |
| Identity | None — unless given a `registry`, which synthesizes a carrier library with its own `LoadedModules` key and `config.<name>` namespace | Rides on the carrier library's identity |

```typescript
// a group assembled once, as a composable unit
export const analyticsPlugin = LibraryGroup({
  name: "analytics",
  members: [ANALYTICS_INGEST, ANALYTICS_API, ANALYTICS_STORE],
});

// or: a library that always drags its bundle along.
// `depends` wires them before you AND carries their types;
// `implies` does membership + types WITHOUT forcing an ordering edge.
export const ANALYTICS_FRONT = CreateLibrary({
  name: "analytics_front",
  depends: [ANALYTICS_STORE, ANALYTICS_API],
  services: { ... },
});
```

Every group, `depends` closure, and `implies` bundle flows into one `flattenLibraries` pass that expands them into a flat, identity-deduped list of plain libraries. Dedup is by object identity, so the same singleton reached through two paths collapses to one entry. Reach a shared base through two paths — a diamond — and it's deduped with a hygiene `warn`; the boot manifest tracks provenance, so `showExtraBootStats` shows you every member and which path(s) brought it in. A group that transitively contains itself, or a mutual `implies` chain, throws `COMPOSITION_CYCLE` instead of looping.

None of that touches ordering. Membership is resolved first; `buildSortOrder` runs afterward on the flattened set, reading each member's `depends` again — the same field, used once for the membership closure and once for the sort. Two passes, two concerns.

## The part that bites silently: types across a package

Membership is the easy half. The hard half is that a consumer who imports **only** the carrier library should also get its depended and implied members' *types* — `params.analytics_store` fully typed — without importing or naming them.

That's not free. `TServiceParams` is built from the global `LoadedModules` interface, which each library extends by declaration merging. An augmentation only applies if the file holding it is in your compilation. Import the carrier and not the members, and by default the members' augmentations never reach you. (I wrote up [the exact emit mechanism separately](./function-vs-arrow-declaration-emit) — it hinges on whether the carrier's `.d.ts` keeps a reference back to each member's module, which in turn hinges on the members using named `function` services.)

The fix on the composition side is small: `CreateLibrary` captures `depends` and `implies` as `const` tuples, carried as extra type parameters on `LibraryDefinition`:

```typescript
CreateLibrary<
  S, C,
  const Depends extends readonly RollupMember[] = readonly [],
  const Implied extends readonly RollupMember[] = readonly [],
>(
  options: LibraryConfigurationOptions<S, C> & {
    depends?: Depends;
    implies?: Implied;
  },
): LibraryDefinition<S, C, Depends, Implied>
```

Capturing the literal tuple is what makes the carrier's emitted declaration spell out each member by `typeof import("./member.mjs").Service` — the edge that drags the member's augmentation into the consumer. With named-function services, `params.<member>` is typed and wired, no registration, no re-export. (A `LibraryGroup` without a `registry` has no carrier identity to hang this on; its members surface as their own `params.<member>` entries instead. `depends` and `implies` are the easy case — they ride on a real named library.)

## The circular dependency I had to *not* solve

My first instinct was the obvious one: derive the implied members' keys and fold their APIs straight into `TServiceParams`. Walk the `implies` tuple, pull each member's service map, intersect it in.

It does not type-check, and it *can't* — it's provably circular. The key set I wanted to compute depends on resolving each member's definition; a member's definition includes its `services: ServiceMap`; and a `ServiceMap`'s functions take `TServiceParams` — the very type I was in the middle of defining. TypeScript calls it as it sees it: `TS2456`, type alias circularly references itself. Every shape of "reach into the members and surface their keys" I tried bottomed out at the same cycle.

The resolution was to do **less**, not more. Don't derive keys at all. Capture the tuple, leave the members' own `declare module` augmentations exactly where they are, and let the import edge carry them. The type system already knows how to merge a `LoadedModules` augmentation it encounters — I don't have to re-surface anything; I just have to make sure the consumer's program *encounters* the member file. The tuple capture does that. The circular version was me trying to do the compiler's job; the working version is ~24 lines that let the compiler do it.

That's the part I'd flag for anyone designing this kind of API: when the type you need depends on resolving the things that reference that type, stop deriving and start letting the language's own merge do the work.

## Membership is not ordering — and the wire-time snapshot proves it

One more subtlety the runtime makes unavoidable. `params` is a **wire-time snapshot** — when a service wires, it's injected with the modules loaded *so far*, not a live proxy that fills in later. So a service can only call peers that wired *before* it.

That's why ordering is a real axis and not a footnote. `depends` gives you the ordering edge **and** membership **and** types in one declaration — so for the common case, where you call into a peer while wiring, `depends` alone is the whole answer:

```typescript
export const LIVING_ROOM = CreateLibrary({
  name: "living_room",
  depends: [LIGHTING],   // ordering + membership + types, all from one line
  services: { Scenes },
});
```

A consumer that lists only `LIVING_ROOM` still gets `LIGHTING` — present, wired before it, and typed on `params.lighting` — without naming it. Drop the `depends` and `LIGHTING` is back to being your problem to enumerate *and* to order.

`implies` is the off-diagonal case: membership and types **without** an ordering edge. You reach for it when you want a library guaranteed present in the boot but explicitly *don't* want to force it ahead of you in the sort — a peer you only touch lazily, well after wiring. It's the narrow escape hatch, not the default; if you call into the library at wiring time, you want `depends`.

| | Membership | Ordering edge | Typed on `params` |
|---|:---:|:---:|:---:|
| `depends` | ✅ (transitive) | ✅ | ✅ |
| `implies` | ✅ | ❌ | ✅ |
| `optionalDepends` | ❌ | ✅ (if present) | ❌ |

Membership and ordering are different questions. `depends` answers both; `implies` and `optionalDepends` each answer exactly one. Pick by which axes you actually need.

## Proof that ships

This is exactly the kind of cross-package, cross-version behavior that quietly rots, so it ships with a guard. `examples/implies-propagation` is a real two-package workspace: a library with named-function services, a carrier that pulls it in, and an app that imports **only** the carrier and reads `params.lighting`. It builds against the local core, type-proves the member is present and genuinely typed (not `any`), then runs to show the library wired without ever being listed. It runs in CI on every PR — covering both `depends` and `implies` members, since they share the same emit edge — so if a future TypeScript release stops carrying the augmentation across the boundary, the job goes red instead of a downstream user finding out the hard way.

**What you get:**

- `libraries` arrays that compose instead of enumerate — bundle with `LibraryGroup`, or let a library pull its dependents along with `depends` (or `implies` when you want membership without an ordering edge).
- Depended and implied members typed *and* wired across a package boundary, with no manual registration — provided their services are named `function` declarations.
- A clean split between membership and ordering, enforced by the runtime's wire-time snapshot rather than by convention.
