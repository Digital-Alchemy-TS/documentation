---
slug: 2024-05-synapse-upgrades
title: Synapse Upgrades - 2024-05
authors: [zoe-codez]
---

## 🚀 Major changes

- transition from YAML config to UI based config flows
	- make sure to update `configuration.yaml`
- applications are treated as "hubs" or "bridges" in the home assistant model
	- the application will define a device entity, and assign all your devices to that device
- support for all domains except:
	- air quality
	- calendar
	- conversation
	- device tracker
	- speech to text
	- wake word detection
	- weather
- new http (fastify) dependency
- zeroconf support
- standardized workflows
- support for multiple connected applications in home assistant

## 📟 Devices

Synapse will generate a default device based on your application configuration to credit all of your entities against. This is unique to the individual application.

> **Note:** Future versions will allow the creation of additional devices within your application, to further group together batches of entities into logical units in a way that's different from `label` / `area`

## 📡 HTTP Dependency

There is now a hard dependency on `fastify` + requiring an open port for apps using `synapse`. Home Assistant architecturally doesn't allow for configuration via websocket, the required APIs are not available to the flow at all.

You can configure the port by setting the `fastify.PORT` configuration (default: `3000`).

### 📣 Zeroconf

> Multicast DNS (mDNS) enables devices on a local network to resolve hostnames without a centralized DNS server

Home Assistant has support for `mDNS` discovery. `synapse` uses the [bonjour](https://www.npmjs.com/package/bonjour) library to provide announcements that it exists, to be picked up by home assistant 🤞

**Note**: this is still experimental and may have some quirks

### 🔍 Manual Discovery

You can also add your app via the standard **ADD INTEGRATION** button in the bottom/right of the integrations tab. Search for "synapse" or "Digital Alchemy" to locate. Provide a target host, and it will load from there. Example allowed formats:

- `http(s)://my.app` (domain)
- `http://ip:port` (with http)
- `ip:port` (bare)

## 🏗️ Domain support

**Note**: many new domains are in a "theoretically working" state. They were built against HA docs, and have not been compared against code / verified working.

- alarm_control_panel
- binary_sensor
- button
- camera
- climate
- cover
- date`*`
- datetime`*`
- fan
- image
- lawn_mower
- light
- lock`*`
- media_player
- notify
- number`*`
- remote
- scene
- select`*`
- sensor
- siren
- switch`*`
- text`*`
- time`*`
- todo_list
- update
- vacuum
- valve
- water_heater

### 🦺 Managed Domains

Items with `*` in the above list feature a `managed` boolean as part of their configuration (default: `true`). Additional support will be added in the future

While active, entities created via these domains do not require extra code beyond initial creation to do normal operations.
Entity will automatically adjust state in response to events, allowing you to stick to using APIs from the `hass` library.

- switches will automatically adjust state for `turn_on` | `turn_off` | `toggle`
- inputs will automatically update values

To provide your own custom logic (adding validation, custom delays, etc) you can attach to relevant events yourself and set `managed: false`

## 📓 Architecture Notes

- A lot of the internal workflows are theoretically white label friendly
- Future versions of `synapse` will be compatible with a 100% rest based implementation, with support for header based auth
- `synapseEntity.onUpdate` internally proxies `hass.entity.byId(...).onUpdate`
	- synapse will take the `unique_id` it provided for the entity, look that up in the entity registry to find the `entity_id`, then do the attachment from there
	- if entity is not yet registered (you haven't completed the config flow for example), this is expected to fail

### 📑 New standard entity attributes

- `attributes` is supported as a standard across every entity
	- recommended to stick to static data, but it is possible to alter values
- `suggested_object_id` exposed
	- `entity_id` = `{domain}.{suggested_object_id}[appended numbers]`
- `unique_id` exposed
	- By default it is based off some of the entity data. You may lock it down to force a specific value to identify this entity in comms. This will prevent it from being changed if you alter other properties in the entity definition
- `entity_category` exposed
	- optionally flag the entity as `config` | `diagnostic`, altering the way they interact with indirect service calls (not currently supported by `type-writer`)

### 🎬 Internal Workflows

The Python integration does most of it's communication with the TS library via the `hass` event bus. These cover interactions such as:

- application heartbeat & availability synchronization
- rpc
- state changes

#### 🦮 EventEmitter

Over the socket, these event names have been standardized to be properly namespaced. On the Typescript side, there is a new **bus transfer** mechanism to deal with the `rpc` items. The entity will listen to the `hass` event bus for events affecting it, and transfer that to the internal `EventEmitter` for standardized attachments

```typescript
const acp = synapse.alarm_control_panel({
  arm_night: ({ code }) =>
    logger.info({ code }, `arm_night called with code via static attachment`),
  context,
  name: "Example alarm panel",
});
acp.onArmNight(({ code }) =>
  logger.info({ code }, `arm_night called with code via dynamic attachment`)
);
```

All function calls available on the python are mapped to the Typescript side. They are available as either their event name directly in the declaration of the entity, or as a named attachment on the return object. Both follow the same removable pattern available on entities:
- final argument is `remove: () => void`
- return object is `{ remove: () => void }`, which contains the same function

> **Note:** no methods that expect a return on the python side are provided. For the most part, these are expected to provide `bytes` back, and there are related properties to provide the same data via a URL instead for most. This mostly affects images (album art for media_player, cameras, etc)

### ⚙️ Entity Configuration & State

The concept of "entity configuration" is being introduced. These define the configuration properties available to an entity. Some are common to all domains (`icon`) and some are specific to a single / few domains (`max_temperature`).

Where available, it is some level of **REQUIRED / PREFERRED / RECOMMENDED / BEST PRACTICE** to set these values instead of state. This varies by domain, with some states being derived from a combination of boolean configurations instead of being settable directly

The general interaction flow for configurations looks like this:

```typescript
const acp = synapse.alarm_control_panel({
  // set the default state as a top level property
  changed_by: "Fred",
});
event.on(
  "obvious_example_event",
  // interact with .configuration property on proxy
  (blame: string) => (acp.configuration.changed_by = blame)
);
```

#### Asterisks

Some properties provided to the constructor are used for internal `synapse` workflows and are not forwarded to Home Assistant. These do NOT appear on `.configuration`

### 🔋Value Restoration

There are multiple paths towards persisting values within synapse:

#### Typescript Side

Before sending values to Home Assistant, all values are stored in the cache. On reloading, the cache is checked as a source of truth. If not available, the current entity state will be checked, falling back to your provided defaults, and finally to hard coded library defaults

> Attaching a Redis cache is currently the most reliable method for state restoration

#### Home Assistant

The integration REQUIRES a connection to your application in order to operate properly. If you reboot Home Assistant, and your application is not actively running, you will receive a configuration error.

> Future features will allow the integration to use some of Home Assistant's storage features to allow it to provide the last known state snapshot back to the app. This is intended to be endgame, requiring no additional dependencies

## 🤕 Known issues

- no branding icons
	- requires additional art to be branding repo yet
- `supported_features` is essentially unusable in current form
- imprecise types in spots
- configurations that should not be changing at runtime can be updated (ex: `supported_features`)
- no support for auth protocols in integration
- unclear policy on sending no-op state change messages
- updates to open / map ports on the quickstart aren't implemented yet
- some entity configurations have no effect without matching `supported_features` set
- `icon` isn't typed more specific than `string` (wontfix)
- no support for rest only applications
