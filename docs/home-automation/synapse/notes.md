---
title: 📓 Misc Notes
sidebar_position: 6
---

## Using entity attributes

Entity attributes are a convenient spot to attach extra properties, but they should not be used for values that change frequently.
Instead, additional sensors should be created to contain value

## `unique_id`

Synapse deals with all entities internally by `unique_id`, not `entity_id`.
The unique_id cannot be changed once the entity is created (unlike entity_id), and is shared on both sides to agree on which entity is being talked about.
It is associated with Home Assistant's own databases, being used for things like state history tracking.

The default generation logic uses a combination of app name + entity `suggested_object_id`/`name` to create a hash.
Relying on the default generation is recommended for most situations.

### Application id

Your synapse application will also have it's own `unique_id` which is used to coordinate application entity registries.
This will be automatically generated for your application based on:

- system hostname
- system username
- application name

This is intended to be stable and not need overriding for basic setups.
For more complicated setups (sharing code between systems or situations where hostname may change) you may want to override with a hard coded uuid.

## Syncing & `dev` / `prod` setups

Local development & external production setups is a supported operation, but requires additional configuration for your app.
This should be done within the configuration provided in your `bootstrap` call.
A simple hard coded uuid will ensure that all instances of your application identify as the same thing when talking to Home Assistant.

```typescript
HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      METADATA_UNIQUE_ID: "hard_coded_value"
    }
  },
});
```

**Extra notes**

- running BOTH setups at the same time may lead to undefined behavior
  - stop `prod` before starting `dev`
- stored state in sqlite database is **NOT** automatically synced, and will match the machine
- no critical information is stored in sqlite db, and it may be removed to "reset" at any time

## Sync not working

While sync mechanisms are generally resilient; it is possible to find your application in a state that the entity appears to exist, but state changes are not being reflected within Home Assistant.
The fix for this is to fully reset the app/integration.

1. remove device ([🖼️](/img/synapse_delete.png))
2. stop your application
3. reboot home assistant
4. *optional:* remove synapse db
5. start app and re-add to home assistant

## 🛠️ Managed Domains

Certain domains have a `managed` flag available as part of their definitions. This boolean (default: `true`) will automatically set up listeners for incoming events, and automatically update the state accordingly.

If you want to disable all automatic logic and fully take over state management, make sure to turn this off.
