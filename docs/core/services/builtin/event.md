---
title: Event
id: event
sidebar_position: 3
description: ""
---

The `event` param is an application scoped instance of `EventEmitter`, intended to make cross-service evented patterns easily accessible.

```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function MyService({ event }: TServiceParams) {
  // standard EventEmitter interface
  event.on("event", callback);
}
```

Everything registered on the global `event` object will be cleaned up when the application shuts down
