---
title: Service Runner
---

`ServiceRunner` is a specialized wrapper for light weight script based on the existing techniques.

It operates as a single application module, without requiring integration with `LoadedModules`.
The module will identify itself as `dynamic` by default.

## Example Code

```typescript
import { ServiceRunner } from "@digital-alchemy/core";
import { LIB_API } from "@cool-org/logic";

await ServiceRunner({
  configuration: {
    ENTITY_ID: {
      type: "string"
    }
  },
  libraries: [LIB_API]
  bootstrap: { bootLibrariesFirst: true },
  name: "dynamic", // default value
},async function ({ logger, config, api }) {
  logger.info(config.dynamic.EXAMPLE);
});
```

With the help of the built in config loader, this can be run as a script

```bash
npx tsx src/main.ts --entity_id="switch.example"
```
