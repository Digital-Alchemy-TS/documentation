## Description

The call proxy is a deceptively simple service to provide a natural feeling service calling interface for home assistant. It creates a general proxy interface, and passes through any valid call call through to the websocket as a service call.

Parameters are not validated at runtime, the only check is to ensure that a valid `domain.service` was used to form the service call.

## Custom Types

The real complexity comes from the integration with the dynamic types created by #Support/type-writer. These types allow the generic proxy to be customized to a particular instance inside of the editor