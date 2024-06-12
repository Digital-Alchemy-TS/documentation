---
title: "🤡 Mock Assistant"
authors: [zoe-codez]
sidebar_position: 9
---

Mock Assistant is a companion project that comes as part of the `@digital-alchemy/hass` project.
It's role is to assist with the process of creating test fixtures, and injecting them into an application that is being tested.
The library also contains some useful functions for emitting state changes to trigger application logic for tests.

### Setting up fixtures

Setting up fixtures is a 2 part process. First, we need to store all the details about your entities & registry in a file. This file will later be read from as part of the testing process instead of connecting to your real instance.

> **WARNING**: This fixtures file contains detailed information about your setup, potentially including information you do not wish to share. Take care with committing it

You can generate these types using the script.

```bash
npx mock-assistant
# or
node node_modules/@digital-alchemy/hass/dist/mock_assistant/main.js
```

The configuration file from [type-writer](/docs/home-automation/type-writer) is compatible with the script.

```bash
npx mock-assistant --config ./.type_writer
```

By default, the script will output to `fixtures.json` in the root of the project.
The file is intended to be shared between all tests, but you can specify a different file via configuration if your needs require multiple files.

## Using in with tests

Using with an existing application. The library, along with services to facilitate testing, can be inserted into the application structure during bootstrap.
Below is an example function that will

```typescript
import { TServiceParams } from "@digital-alchemy/core";
import { LIB_MOCK_ASSISTANT } from "@digital-alchemy/hass/mock-assistant";

 await UNIT_TESTING_APP.bootstrap({
  // Testing hooks library
  appendLibrary: LIB_MOCK_ASSISTANT,
  appendService: {
    TestRunner({ mock_assistant, ... }: TServiceParams) {
      // ... a safe place to run your tests
    }
  },
  configuration: {
    // prevent the application from connecting via socket, even if otherwise properly configured
    hass: { MOCK_SOCKET: true },
  },
});
```
