---
title: "Composing libraries without a type black hole: RollupLibraries, implies, and the circular dependency I had to *not* solve"
date: 2026-06-16
description: "Two opt-in composition primitives for Digital Alchemy, the wire-time snapshot that makes membership and ordering different problems, and why surfacing implied types automatically meant doing less, not more."
---

Once a Digital Alchemy app grows past a handful of libraries, the `libraries` array stops being a list and becomes a chore. Each plugin-like group is itself several libraries, and the application has to name every one of them, plus every transitive dependency, in one flat array. Miss one and boot throws `MISSING_DEPENDENCY`. It works, but you're hand-maintaining a dependency graph that the libraries already know.

So core now has two opt-in primitives for composing that list — and getting them to carry types across a package boundary led me straight into a circular dependency I deliberately left unsolved. That second part is the interesting one.

<!--truncate-->

## Two axes nobody tells you are separate

Bootstrapping needs two different things from you, and they're orthogonal:

- **Membership** — *which* libraries exist. That's the application's `libraries` array. It has to be complete and flat.
- **Ordering** — *what wires before what*. That's each library's own `depends` / `optionalDepends`, topologically sorted.

The trap is assuming `depends` does both. It doesn't. `depends` declares an ordering edge and is *validated* against membership — but it never *adds* anything to membership. Both composition primitives below add to membership and touch ordering not at all.

## `RollupLibraries` and `implies`

They solve adjacent problems and feed the same resolver:

| | `RollupLibraries` | `implies` |
|---|---|---|
| What it is | A **nameless** composition value | A field on a **named** library |
| Use when | You want to bundle N libraries as a unit nobody injects | Loading library X should always bring Y, Z |
| Identity | None — no `LoadedModules` key, no DI node | Rides on the carrier library's identity |

```typescript
// a group authored once, as a composable unit nobody injects directly
export const analyticsPlugin = RollupLibraries(
  [ANALYTICS_INGEST, ANALYTICS_API, ANALYTICS_STORE],
  { label: "analytics" },
);

// or: a library that always drags its bundle along
export const ANALYTICS_FRONT = CreateLibrary({
  name: "analytics_front",
  implies: [ANALYTICS_STORE, ANALYTICS_API],
  services: { ... },
});
```

Both flow into one `flattenLibraries` pass that expands every rollup and `implies` bundle into a flat, identity-deduped list of plain libraries. Dedup is by object identity, so the same singleton reached through two groups collapses to one entry. Reach a shared base through two paths — a diamond — and it's deduped with a hygiene `warn`; the boot manifest tracks provenance, so `showExtraBootStats` shows you every member and which path(s) brought it in. A rollup that transitively contains itself, or a mutual `implies` chain, throws `COMPOSITION_CYCLE` instead of looping.

None of that touches ordering. Membership is resolved first; `buildSortOrder` runs afterward on the flattened set, using each member's own `depends`. Two passes, two concerns.

## The part that bites silently: types across a package

Membership is the easy half. The hard half is that a consumer who imports **only** the implier should also get the implied libraries' *types* — `params.analytics_store` fully typed — without importing or naming them.

That's not free. `TServiceParams` is built from the global `LoadedModules` interface, which each library extends by declaration merging. An augmentation only applies if the file holding it is in your compilation. Import the implier and not the members, and by default the members' augmentations never reach you. (I wrote up [the exact emit mechanism separately](./function-vs-arrow-declaration-emit) — it hinges on whether the implier's `.d.ts` keeps a reference back to each member's module, which in turn hinges on the members using named `function` services.)

The fix on the composition side is small: `CreateLibrary` captures `implies` as a `const` tuple, carried as a third type parameter on `LibraryDefinition`:

```typescript
CreateLibrary<S, C, const Implied extends readonly RollupMember[] = readonly []>(
  options: LibraryConfigurationOptions<S, C> & { implies?: Implied },
): LibraryDefinition<S, C, Implied>
```

Capturing the literal tuple is what makes the implier's emitted declaration spell out each member by `typeof import("./member.mjs").Service` — the edge that drags the member's augmentation into the consumer. With named-function services, `params.<member>` is typed and wired, no registration, no re-export. (Nameless rollups can't do this — they have no name and no declaration-merge identity — so they fall back to a `LoadedRollups` block. `implies` is the easier case, not the same one.)

## The circular dependency I had to *not* solve

My first instinct was the obvious one: derive the implied members' keys and fold their APIs straight into `TServiceParams`. Walk the `implies` tuple, pull each member's service map, intersect it in.

It does not type-check, and it *can't* — it's provably circular. The key set I wanted to compute depends on resolving each member's definition; a member's definition includes its `services: ServiceMap`; and a `ServiceMap`'s functions take `TServiceParams` — the very type I was in the middle of defining. TypeScript calls it as it sees it: `TS2456`, type alias circularly references itself. Every shape of "reach into the members and surface their keys" I tried bottomed out at the same cycle.

The resolution was to do **less**, not more. Don't derive keys at all. Capture the tuple, leave the members' own `declare module` augmentations exactly where they are, and let the import edge carry them. The type system already knows how to merge a `LoadedModules` augmentation it encounters — I don't have to re-surface anything; I just have to make sure the consumer's program *encounters* the member file. The tuple capture does that. The circular version was me trying to do the compiler's job; the working version is ~24 lines that let the compiler do it.

That's the part I'd flag for anyone designing this kind of API: when the type you need depends on resolving the things that reference that type, stop deriving and start letting the language's own merge do the work.

## Membership is not ordering — and the wire-time snapshot proves it

One more subtlety that the runtime makes unavoidable. `params` is a **wire-time snapshot** — when a service wires, it's injected with the modules loaded *so far*, not a live proxy that fills in later. So a service can only call peers that wired *before* it.

`implies` adds membership; it does **not** add an ordering edge. So if you `implies` a library and call into it while wiring, it may not be there yet — membership guarantees it exists *somewhere* in the boot, not that it's already up. That's what `depends` is for. The two are complementary, and a realistic library uses both:

```typescript
export const LIVING_ROOM = CreateLibrary({
  name: "living_room",
  depends: [LIGHTING],   // ordering: LIGHTING wires before me, so I can call it
  implies: [LIGHTING],   // membership + types: a consumer listing only me still gets LIGHTING
  services: { Scenes },
});
```

Drop `implies` and the consumer has to list `LIGHTING` itself. Drop `depends` and `LIGHTING` might wire *after* `living_room`, leaving `params.lighting` undefined at call time. Membership and ordering are different questions; composition only answers the first.

## Proof that ships

This is exactly the kind of cross-package, cross-version behavior that quietly rots, so it ships with a guard. `examples/implies-propagation` is a real two-package workspace: a library with named-function services, an implier that `implies` it, and an app that imports **only** the implier and reads `params.lighting`. It builds against the local core, type-proves the implied member is present and genuinely typed (not `any`), then runs to show the library wired without ever being listed. It runs in CI on every PR — if a future TypeScript release stops carrying the augmentation across the edge, the job goes red instead of a downstream user finding out the hard way.

**What you get:**

- `libraries` arrays that compose instead of enumerate — bundle with `RollupLibraries`, or let a library drag its dependents along with `implies`.
- Implied members typed *and* wired across a package boundary, with no manual registration — provided their services are named `function` declarations.
- A clean split between membership and ordering, enforced by the runtime's wire-time snapshot rather than by convention.
