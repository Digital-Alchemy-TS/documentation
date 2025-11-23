---
title: Services
id: services_index
sidebar_position: 1
description: ""
---

Services with Digital Alchemy follow a function pattern, taking in a standard single param containing the rest of your application resources.

## Service Returns

The return reponse of your service is provided back to other services in your application as a callable interface.
There are 2 supported styles of service returns - `object` & `function`

### Object Returns

Objects are the perfect choice for services to return when there is more than 1 item that you want to provide access to -

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function MyService({ logger, ... }: TServiceParams) {
  const registry = new Map();

  function methodA() {
    // logic
  }
  function methodB() {
    // logic
  }

  return {
    registry,
    methodA,
    methodB,
  }
}
```

The contents of the object can be anything you want


### Function Returns
