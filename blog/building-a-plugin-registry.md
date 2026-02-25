---
title: Building a Plugin Registry with Digital Alchemy
date: 2026-02-24
description: "How to build a dynamic adapter system where each backend is an independently-configured library that self-registers at boot."
---

There's a pattern that shows up repeatedly in production Digital Alchemy applications: a central service that manages a set of interchangeable backends, where each backend is its own library and self-registers at startup. No hardcoded coupling between the core and any specific backend. Adding a new adapter is one file and one line.

This post walks through how it works.

<!--truncate-->

## The problem

Imagine you're building a service that routes work to one of several external backends — payment processors, notification providers, data enrichment APIs. You start with one. Then you add a second. Then a third.

The naive implementation ends up like this:

```typescript
switch (provider) {
  case "provider_a": return await providerA.fetch(request);
  case "provider_b": return await providerB.fetch(request);
  case "provider_c": return await providerC.fetch(request);
  default: throw new Error(`Unknown provider: ${provider}`);
}
```

This works until it doesn't. Every new backend means editing the core service. Tests for one backend pull in all the others. Configuration for every provider lives in one place even though most environments only use one.

There's a better shape.

## The shape of a plugin

Each backend becomes a `CreateLibrary` — a self-contained unit with its own config entries, its own services, and no knowledge of the other backends.

```typescript title="src/libraries/provider-a/index.mts"
import { CreateLibrary } from "@digital-alchemy/core";
import { ProviderAService } from "./provider-a.service.mts";
import { LIB_REGISTRY } from "../registry/index.mts";

export const LIB_PROVIDER_A = CreateLibrary({
  name: "provider_a",
  depends: [LIB_REGISTRY],
  configuration: {
    API_URL: { type: "string", required: true },
    API_KEY: { type: "string", required: true },
    IS_ACTIVE: { type: "boolean", default: true },
  },
  services: {
    provider: ProviderAService,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    provider_a: typeof LIB_PROVIDER_A;
  }
}
```

The library has three things:
- Its own config namespace (`provider_a.API_URL`, `provider_a.API_KEY`)
- An `IS_ACTIVE` flag — more on that below
- A `depends` declaration on `LIB_REGISTRY`, which makes the registry available at wiring time

## The registry service

`LIB_REGISTRY` is a shared library that lives in its own module. It holds a `Map` of registered providers and exposes a `register()` function that adapters call at wiring time.

```typescript title="src/libraries/registry/registry.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

type ProviderEntry = {
  name: string;
  isActive: boolean;
  fetch: (request: FetchRequest) => Promise<FetchResult>;
};

export function RegistryService({ logger }: TServiceParams) {
  const registry = new Map<string, ProviderEntry>();

  return {
    register(entry: ProviderEntry) {
      if (!entry.isActive) {
        logger.debug({ name: entry.name }, "provider inactive, skipping registration");
        return;
      }
      registry.set(entry.name, entry);
      logger.info({ name: entry.name }, "provider registered");
    },

    get(name: string) {
      return registry.get(name);
    },

    all() {
      return [...registry.values()];
    },

    names() {
      return [...registry.keys()];
    },
  };
}
```

The registry doesn't know about any specific backend. It's just a `Map` with a typed `register()` call.

:::note priorityInit
If other services read from the registry during wiring, declare `RegistryService` in `priorityInit` in the library definition. This ensures it wires before any adapter tries to register with it.

```typescript
export const LIB_REGISTRY = CreateLibrary({
  name: "registry",
  priorityInit: ["registry"],
  services: { registry: RegistryService },
});
```
:::

## Self-registration

Each adapter's primary service registers itself with the registry at wiring time — not in a lifecycle callback:

```typescript title="src/libraries/provider-a/provider-a.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

export function ProviderAService({ config, registry, logger, context }: TServiceParams) {
  // Register at wiring time — registry is available because we declared `depends: [LIB_REGISTRY]`
  registry.registry.register({
    name: "provider_a",
    isActive: config.provider_a.IS_ACTIVE,
    async fetch(request) {
      const response = await globalThis.fetch(config.provider_a.API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${config.provider_a.API_KEY}` },
        body: JSON.stringify(request),
      });
      return response.json();
    },
  });
}
```

Wiring-time registration works because `depends: [LIB_REGISTRY]` ensures the registry service is wired before this service runs. The return value of `RegistryService` is already available — no lifecycle hook needed.

## The trenchcoat

In the application module, you collect all your adapter libraries in an array:

```typescript title="src/app.module.mts"
import { CreateApplication } from "@digital-alchemy/core";
import { LIB_REGISTRY } from "./libraries/registry/index.mts";
import { LIB_PROVIDER_A } from "./libraries/provider-a/index.mts";
import { LIB_PROVIDER_B } from "./libraries/provider-b/index.mts";
import { LIB_PROVIDER_C } from "./libraries/provider-c/index.mts";
import { RouterService } from "./services/router.service.mts";

const ADAPTERS = [LIB_PROVIDER_A, LIB_PROVIDER_B, LIB_PROVIDER_C];

export const MY_APP = CreateApplication({
  name: "my_app",
  libraries: [LIB_REGISTRY, ...ADAPTERS],
  services: {
    router: RouterService,
  },
});
```

Adding a new backend: create a new library, add it to `ADAPTERS`. No other file changes.

## Dynamic routing

Because the registry is populated at wiring time, you can derive routes (or any dynamic behavior) from `registry.names()` at boot:

```typescript title="src/services/router.service.mts"
import type { TServiceParams } from "@digital-alchemy/core";

export function RouterService({ registry, lifecycle, logger }: TServiceParams) {
  lifecycle.onReady(() => {
    const active = registry.registry.names();
    logger.info({ providers: active }, `routing active for ${active.length} providers`);
  });

  return {
    async route(providerName: string, request: FetchRequest) {
      const provider = registry.registry.get(providerName);
      if (!provider) {
        throw new Error(`No provider registered: ${providerName}`);
      }
      return provider.fetch(request);
    },
  };
}
```

## Enable/disable per environment

`IS_ACTIVE: { type: "boolean", default: true }` on each adapter means you can selectively disable backends without changing code. In an environment where only provider A should run:

```bash
PROVIDER_B__IS_ACTIVE=false
PROVIDER_C__IS_ACTIVE=false
```

The adapter libraries are still wired — their config still loads — but the `register()` call is skipped. The registry has no entry for them. The router raises a clean error if they're requested.

This gives you a single deployment image that works across every environment.

## Testing in isolation

`TestRunner.replaceLibrary()` replaces an entire library with a mock. To test the router with only a fake provider:

```typescript
await TestRunner(MY_APP)
  .replaceLibrary(LIB_PROVIDER_A, {
    services: {
      provider: () => {
        // Register a mock that always returns a fixed result
        registry.registry.register({
          name: "provider_a",
          isActive: true,
          async fetch() {
            return { price: 42 };
          },
        });
      },
    },
  })
  .run(async ({ my_app }) => {
    const result = await my_app.router.route("provider_a", { id: "test" });
    expect(result.price).toBe(42);
  });
```

Other adapters can be disabled in the test environment entirely: `IS_ACTIVE: false` in the test runner's `configure()`.

## What you get

- **Isolated adapters** — each library owns its config namespace, its services, and its tests
- **Zero coupling** — the registry and router have no imports from any specific adapter
- **Dynamic everything** — routes, active providers, feature gating all derive from the registry at boot
- **Clean tests** — test one adapter without touching the others
- **One-line additions** — new adapter = new library + one line in the `ADAPTERS` array
