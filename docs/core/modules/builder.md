---
title: Module Builder
---

Digital Alchemy `core` supports a builder pattern to help build up specialized modules for different use cases. The internal modules power:

- `CreateLibrary`
- `CreateApplication`
- `TestRunner`

These can all be translated between each other, but the intended use for the builder is to facilitate unit testing.
The tools also allow for the creation of modules free from the type constraints that are enforced on the normal creation tools.

## 🗃️ API

### 📐 Creation

Module creation starts with the `createModule` import from `@digital-alchemy/core`.

```typescript
import { createModule } from "@digital-alchemy/core";

// blank / empty module
// only contains access to core tools
const myModule = createModule();
```

Modules can be blank, but most useful modules will be based off an existing one.

```typescript
import { LIB_SPECIAL_THING } from "./my_library";
import { HOME_AUTOMATION_APP } from "./main";

const genericFromLib = createModule.fromLibrary(LIB_SPECIAL_THING);
const genericFromApp = createModule.fromApplication(HOME_AUTOMATION_APP);
```

#### 💢 Gotcha

If your code is based off the standard quickstart projects, you will have a `main.ts` that looks something like this:

```typescript
const MY_APP = CreateApplication(...);
setImmediate(() => MY_APP.bootstrap(...));
```

Utilizing the module builder with your app will require moving the definition of your application to a separate file from the `.bootstrap` call.

> 🤔 Consider `app.module.ts`

### 🖊️ Extension

Once you have your generic module, you can extend from it to start the process of creating a new module.
Care needs to be taken with using these tools to prevent the creation of invalid modules.

#### Libraries

The module dependencies can be manipulated in 2 ways:

> `.appendLibrary(LIBRARY_MODULE)`

```typescript
import { LIB_MOCK_ASSISTANT } from "@digital-alchemy/hass";

myModule.extend().appendLibrary(LIB_MOCK_ASSISTANT);
```

Appended libraries will be loaded at the same the as those defined with the creation of the module, but before the module itself initializes.
This gives the appended library the ability to get ahead and perform [monkey patching](https://en.wikipedia.org/wiki/Monkey_patch) operations & set up state.

You also have the ability to outright replace an existing library with another that shares the same `name`.
The name is the only check made against the module, no attempt to ensure compatibility with types beyond that is made.

> `.replaceLibrary(HOPEFULLY_COMPAT_MODULE)`

```typescript
myModule.extend().replaceLibrary(LIB_REPLACEMENT_HASS);
```

#### Services

Services can be manipulated in similarly unsafe ways to libraries.
You are able to strip out services with functionality that makes tests difficult, make subsets of services operate in isolation, and more.

| Operation | Description |
| --- | --- |
| `.appendService(name: string, service: ServiceFunction)` | Add a new service to the module as if were part of the original definition <sup>(type unsafe)</sup> |
| `.replaceService(name: string, service: ServiceFunction)` | Replace service with a new one <sup>(type unsafe)</sup> |
| `.rebuild(services: Partial<ORIGINAL_SERVICES>)` | Replace the entire service map <sup>(ymmv)</sup> |
| `.omitService(...name: string)` | Remove service(s) by name |
| `.pickService(...name: string)` | Keep listed services, remove others |

### 📒 Casting

Once your module has all of it's substitutions made, you can perform a final transformation to get a more useful module.

- `.toApplication()`
- `.toLibrary()`
- `.toTest()`


> Full example of creating a test runner from an application

```typescript
import { createModule } from "@digital-alchemy/core";
import { HOME_AUTOMATION_APP } from "./main";
import { LIB_MOCK_ASSISTANT } from "@digital-alchemy/hass";

export const testRunner = createModule
  .fromApplication(HOME_AUTOMATION_APP)
  .extend()
  .appendLibrary(LIB_MOCK_ASSISTANT)
  .toTest();
```
