---
title: Feature
id: hass-feature
sidebar_position: 1
---

The `feature` service contains utilities for interacting with Home Assistant's entity supported features from within typescript.
Feature flags for entities arrive as a `supported_features` attribute, attached as a number.

In order to decode this number, bit shifting operations and a reference table for values needs to be on hand.

| method                    | description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| `createSupportedFeatures` | provide an array of features, will returns a number representation               |
| `getSupportedFeatures`    | Takes in an entity (proxy / id) or supported features, returns array of features |
| `hasFeature`              | Used to test if a particlar entity has a feature                                 |
| `listEntityFeatures`      | Returns an array of string features for an entity                                |


```typescript
import { TServiceParams } from "@digital-alchemy/core";

export function ExampleService({ hass, lifecycle }: TServiceParams) {
  lifecycle.onReady(() => {
    const features = listEntityFeatures("light.example_hue_light");
    // features = ["EFFECT", "FLASH", "TRANSITION"]
  });
}
```
