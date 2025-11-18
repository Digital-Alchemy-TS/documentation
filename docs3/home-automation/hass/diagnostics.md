---
title: "🔍 Diagnostics"
sidebar_position: 4
authors: [zoe-codez]
---

The library includes a comprehensive diagnostics system for monitoring performance and debugging issues.

## Configuration

Enable diagnostics by setting the environment variable:

```bash
HASS_EMIT_DIAGNOSTICS=true
```

## Available Channels

### Call Proxy Diagnostics

- `call.fast`: Service calls without response waiting
- `call.response`: Service calls with response data
- `call.reload`: Service list reload events

### Reference Diagnostics

- `reference.get_property`: Property access on entity references
- `reference.create_proxy`: Entity proxy creation
- `reference.call_service`: Direct service calls from entity references

### Websocket Diagnostics

- `websocket.set_connection_state`: Connection state changes
- `websocket.send_ping`: Ping/pong health checks

### Entity Diagnostics

- `entity.history_lookup`: Historical data requests
- `entity.warn_ready`: Early usage warnings

## Usage

Diagnostics are published as events that can be consumed by monitoring systems:

```typescript
export function MonitorService({ hass, event }: TServiceParams) {
  // Monitor service call performance
  event.on("hass.diagnostics.call.fast", (data) => {
    logger.info({ duration: data.ms }, "Service call completed");
  });

  // Monitor entity reference usage
  event.on("hass.diagnostics.reference.get_property", (data) => {
    logger.debug({ entity: data.entity_id, property: data.property });
  });
}
```

## Performance Monitoring

The diagnostics system provides timing information for:

- Service call execution time
- Entity state lookups
- Historical data requests
- Websocket message round-trips

This data can be used to identify performance bottlenecks and optimize your automation logic.
