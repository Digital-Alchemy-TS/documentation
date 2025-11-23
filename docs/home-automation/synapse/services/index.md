---
title: Services
id: synapse-typescript-services
sidebar_position: 3
---

In addition to entities, the synapse library also has the ability to directly create services Home Assistant.

## Syntax

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { ServiceField } from "@digital-alchemy/synapse";

export function SynapseServiceCreate({
  synapse,
  context,
  logger,
  hass,
}: TServiceParams) {
  synapse.service.create(
    {
      context,
      description: "Example service for Digital Alchemy docs",
      fields: {},
      name: "Test Command",
      domain: "synapse",
      target: {},
    },
    async data => {
      logger.info("received service call");
    }
  );

  function runService() {
    // Execute the service we created
    hass.call.synapse.test_command({});
  }
}
```
