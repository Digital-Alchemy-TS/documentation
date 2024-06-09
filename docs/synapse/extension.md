---
title: Extension
---
## 📘 Description

Welcome to the Synapse custom component for Home Assistant!

This library works with [@digital-alchemy/synapse](/synapse) to allow Typescript based applications to create custom entities.

## 🚀 Installing Synapse

> Synapse integrates as a modern UI config flow driven integration.

### 📦 Via HACS (Recommended)

1. Ensure you have [HACS](https://hacs.xyz/) installed in Home Assistant.
2. Open HACS from the Home Assistant sidebar.
3. Navigate to `Integrations`> `+ Explore & add repositories.`
4. Search for "**Digital Alchemy Synapse**" and select it from the list.
5. Click `Install this repository in HACS.`
6. Restart Home Assistant to apply the changes.

### 📁 Manual Installation

If you prefer or need to install the integration manually:

1. Clone or download this repository.
2. Copy the `custom_components/synapse/` directory from the repository into the `<config_dir>/custom_components/` directory of your Home Assistant installation.
3. Restart Home Assistant.

## ⛰️ Scope

The scope of this project is to help bridge the gap between NodeJS/Typescript based applications, and the Home Assistant internals, with a specific focus on entity creation tools.

It is intended to be a very thin adapter, receiving state updates via the internal event bus, and sending out messages in response to service calls.
Entity availability is tied to the connection state of the application to the websocket.

## 🍝 Workflows

You are able to integrate as many applications as you like with Home Assistant.
Internally, each application acts as a bridge to connect a top level default device,generated sub-devices, and entities.
In order to connect a new application, you will need to provide an address to gather information from (`ip:port`, `http(s)://address`).

- **Note**: Your application needs to be online to receive this request or this will fail

After the initial setup, `synapse` will generate a series of devices and entities to reflect what was created inside your application

![integration example](/img/synapse_integration_example.png)

Looking into the default device, you can see the associated entities and sub-device

![default device](/img/synapse_default_device.png)

## 📚 Domain Support

### Verified

- Binary Sensor
- Button
- Date
- Datetime
- Lock
- Number
- Scene
- Select
- Switch
- Text
- Time

### Untested / WIP

- Alarm Control Panel
- Camera
- Climate
- Cover
- Fan
- Humidifier
- Image
- Lawn Mower
- Light
- Media Player
- Notify
- Remote
- Sensor
- Siren
- Todo List
- Update
- Vacuum
- Valve
- Water Heater
