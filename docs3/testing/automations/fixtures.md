---
title: "🚟 Fixtures"
authors: [zoe-codez]
sidebar_position: 1
---

Unit tests connecting to your real instance of Home Assistant would cause all sorts of havoc.

Fortunately you are able to create fixture files and use helper libraries to change the way `hass` works to better set up the conditions for your tests.

## ✏️ Creating fixtures

Setting up fixtures is a 2 part process. First, we need to store all the details about your entities & registry in a file. This file will later be read from as part of the testing process instead of connecting to your real instance.

> **WARNING**: This fixtures file contains detailed information about your setup, potentially including information you do not wish to share. Take care with committing it

You can generate these types using the script.

```bash
npx mock-assistant
# or
node node_modules/@digital-alchemy/hass/dist/mock_assistant/main.js
```

The configuration file from [type-writer](/docs/home-automation/hass/setup/type-writer/) is compatible with the script.

```bash
npx mock-assistant --config ./.type_writer
```

> ✅ Outputs to `/fixtures.json` in the root of the project

The file is intended to be shared between all tests, but you can specify a different file via configuration if your needs require multiple files.

## 📝 Usage in tests

Once the fixtures file is created, all you need to do is append `LIB_MOCK_ASSISTANT` to your test.

```typescript
testRunner.appendLibrary(LIB_MOCK_ASSISTANT)
```

The library will automatically patch `hass` in a way that allows it to work off the target fixtures file instead of requiring live data.

**Included data** -

- registry data
  - zone
  - label
  - area
  - device
  - entity
  - floor
  - label
- configuration setup
- entity states & attributes
- available services
