---
slug: 2024-04-project-updates
title: Project Updates - 2024-04
authors: [zoe-codez]
---
## 🚀 Recent Improvements

### 📈 Editor performance

The `type-writer` script now provides more information about your setup in the form of pre-built string unions. Your editor needs to do much less inferring work during development, resulting in dramatically better performance around in setups with larger quantities of entities

### 🏷 Label Support

The project now has direct support for Home Assistant's new `label` feature, as well as bringing matching support for existing `area`, `floor`, and `device`. You are able to manage `label` & `area` for entities through convenient APIs, making for some easy migrations & writing quick batch operations for your system. Matching querying methods have also been provided:

- `hass.entity.byArea`
- `hass.entity.byFloor`
- `hass.entity.byDevice`
- `hass.entity.byLabel`

All of these methods are set up so they return string unions representing what you will receive at runtime. You are also able to filter by domain, quickly extracting a subset of entities from the existing groups.

- Simple lookup by label: [![img](/img/label_lookup.png)](/img/label_lookup.png)

- Looking up switches by area

| [![lookup error](/img/area_lookup_error.png)](/img/area_lookup_error.png) | [![filter by domain](/img/filter_area_domain.png)](/img/filter_area_domain.png) |
| --- | --- |
| ⛔ Editor will let you know when you are using invalid entities | ✅ quickly filter by domain |

### 👥 Community updates

A few new sections in discord have been added recently better support newcomers to the project.

- help - general q&a forum, get quick answers about the system
- code review - want a second set of eyes to make sure your new automation is going to do what you think it should?

## 🚧 Current development

### 🪟 [Automation Standalone](https://github.com/Digital-Alchemy-TS/automation-standalone)

The current [Automation Quickstart](https://github.com/Digital-Alchemy-TS/automation-quickstart) is intended for HAOS based setups, providing a quick setup script to bring your setup to a running state with a single command.

This new / second quickstart project is aimed at people invested in docker based setups. Target audiences:

- docker based Home Assistant setups
- people who want a template tuned to building / deploying your logic to a container
- anyone looking to get the most out of their setup

Has support for the high performance **Bun** runtime, dedicated testing workflows, and built with Windows friendly workflows.

### 🤖 Unit testing workflows

The unit testing tools surrounding the `hass` library are receiving active attention, with the intent of creating set of tools that can be used to unit test your automations directly. This will be taken advantage of as part of the new quickstart project so you can include test coverage on the list of things you can flex about your setup 💪
