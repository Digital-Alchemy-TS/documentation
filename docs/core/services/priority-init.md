---
title: Initialization Order
id: services_init
sidebar_position: 2
description: ""
---

Digital Alchemy has a defined order for loading services that ensures that dependencies are loaded first prior to loading services from within your modules.

Once it comes time to load your module's services, there is a variety of situations that can influence modules are initialized

## Basic Rules

The initialization order for services is controlled via the module that they are being registered into:

```typescript
CreateApplication({
  name: "home_automation",
  services: {
    climate: ClimateService,
    locks: LocksService,
    registry: RegistryService,
    sensors: SensorsService,
    switches: SwitchesService,
    thermostats: ThermostatService,
  }
});
```

By default, services are initilialized in order provided to services.
In this example, alphabetical order.

## Service level dependencies

Service level dependencies can be created by trying to execute methods provided by your own code prior to the relevant service being created.
Sticking with the above module, a breaking situation might look like this -

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ClimateService({ home_automation }: TServiceParams) {
  // registry is not defined yet!
  home_automation.registry.add(...);
  //               ^^^^^^ is undefined
}
```

The code for these situations will build properly, but at runtime this does not work since `RegistryService` has not been executed yet.

### The fix

There is 2 potential paths to resolving this issue.

1) Using the `registry` logic later in the application lifecycle
2) Force the `RegistryService` to load first

#### With lifecycle hooks

Wrapping logic in a lifecycle event will allow it to run after all services have been created, ensuring all methods are available to call.

```typescript
export function ClimateService({ home_automation, lifecycle }: TServiceParams) {
  lifecycle.onPreInit(() => {
    home_automation.registry.add(...);
  });
}
```

#### Priority Initialization

You can force certain services to build first by using the `priorityInit` array in your module definition.

```typescript
CreateApplication({
  name: "home_automation",
  priorityInit: ["registry"],
  services: {
    climate: ClimateService,
    locks: LocksService,
    registry: RegistryService,
    sensors: SensorsService,
    switches: SwitchesService,
    thermostats: ThermostatService,
  }
});
```

**NOTE**: You do not need to place all services in the priority array, only those with construction time dependicies for other services with the same module.

Once this list is processed, the remaining services will be constructed in normal order.
