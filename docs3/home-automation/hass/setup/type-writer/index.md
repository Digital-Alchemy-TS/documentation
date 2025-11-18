---
title: 🎬 Type Writer
sidebar_position: 1
---
import ReactPlayer from 'react-player'

[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/type-writer)](https://github.com/Digital-Alchemy-TS/type-writer)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/type-writer)](https://www.npmjs.com/package/@digital-alchemy/type-writer)

## Overview

`type-writer` is a companion project to the `hass` project, it exists to fill in all the juicy details to the library generic interfaces.
The project is runnable as a script, which builds type definitions in your project as the output.

### Goal

The script generates outputs for:

- pre-calculated mapping tables for `area`, `device`, `unique_id`, and more
- entity details registry describing `state` & `attributes`
- service call registry with definitions for params and inline support documentation

These files are all grouped together into `src/hass`, which does automatically does it's job just by existing.

### Limitations

- **Intermittent Attributes**
Some entities may add / remove attributes based on various conditions.
This can cause intermittent results depending on when the script is run relative to the entity state.
See [Custom Attributes](/docs/home-automation/hass/setup/type-writer/custom-attributes) guide for notes on how to resolve this.

- **Crashes & missing output**
Occasionally an integration will implement a schema which the code has not been built to translate.
This can simply present as silently missing details, but if severe enough it may result in the script crashing.

Please report if this occurs

## Usage

1. install dependencies

```bash
yarn add -D @digital-alchemy/type-writer
```

2. run script

```bash
npx type-writer
```

3. reload editor

### Configuration

Using a `.env` file is the recommended way to configure `type-writer` if not running within **HAOS**

```
HASS_BASE_URL=http://localhost:8123
HASS_TOKEN=YOUR LONG LIVED ACCESS TOKEN
```

##  How custom definitions present

Pictures really only tell half the story, here is the editing experience in VSCode using the types provided by the library.
See the Intellisense in action

<ReactPlayer playing controls url='/intro.mp4' playing={false} />
