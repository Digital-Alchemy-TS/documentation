---
title: Init Order
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
  name: "example_application",
  services: {

  }
})
```
