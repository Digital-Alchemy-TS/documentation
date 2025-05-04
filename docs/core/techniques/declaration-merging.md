---
title: 📩 Declaration Merging
---

The core library allows for a number of tools for augmenting internal type definitions to make them more friendly to your situation.

## LoadedModules

The `LoadedModules` interface is the most common interface that receives merges.
All applications and libraries require that they have their definitions loaded in order to be usable inside of services.


```typescript
import { CreateApplication, CreateLibrary } from "@digital-alchemy/core";

const MY_APP = CreateApplication(...);
const LIB_THING = CreateLibrary(...);

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    app: typeof MY_APP;
    thing: typeof LIB_THING;
  }
}
```

## DeclaredEnvironments

The `DeclaredEnvironments` is associated with the `config.boilerplate.NODE_ENV` property.

By default, it comes populated with `prod`, `test`, `local`. It can be populated with additional entries

```typescript
declare module "@digital-alchemy/core" {
  export interface DeclaredEnvironments {
    sandbox: true;
    stage: true;
  }
}
```

> Due to the constraints of declaration merging, the required information is taken from the keys

## IsIt

The `is` helper is a utility interface used across the project. Adding types to it is a straightforward operation

> example from `hass` library

```typescript
// declare logic in function
function isDomain<DOMAIN extends ALL_DOMAINS>(
  entity: string,
  domain: DOMAIN | DOMAIN[],
): entity is PICK_ENTITY<DOMAIN> {
  const [test] = entity.split(".") as [DOMAIN, string];
  return [domain].flat().includes(test);
}

// attach to type definition
declare module "@digital-alchemy/core" {
  export interface IsIt {
    domain: typeof isDomain;
  }
}

// attach logic
is.domain = isDomain;
```

> usage

```typescript
function setLightBrightness(entity_id: string, brightness: number) {
  if (!is.domain(entity_id, "light")) {
    throw new Error("That's no light!");
  }
  // ... logic
}
```

## AsyncLocalData

Add your own types to the als extension!

```typescript
declare module "@digital-alchemy/core" {
  export interface AsyncLocalData {
    update_source: PICK_ENTITY;
  }
}
```

## AsyncLogData

Data that can be combined with logs. This is left empty by default, and populated by other intermediate modules.

```typescript
declare module "@digital-alchemy/core" {
  export interface AsyncLogData {
    // web server example
    requestId: string;
    sessionId: string;

    // automation example
    entity_id: PICK_ENTITY;
  }
}
```
