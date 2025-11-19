---
title: Service Calling
id: hass-entity-proxy-services
sidebar_position: 2
---

The final ability of entity references is to issue targeted service calls.
These are a convenience for when the service call's domain is the same as the entity.

```typescript
hass.refBy.id("light.office").turn_on()
// same as
hass.call.switch.turn_on({ entity_id: ["light.office"] });
```
![entity service call](/img/entity_service_call.png)
