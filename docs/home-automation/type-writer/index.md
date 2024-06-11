---
title: 🎬 Type Writer
sidebar_position: 3
---
import ReactPlayer from 'react-player'

## 📝 Description

Welcome to `@digital-alchemy/type-writer`!

This application is a support tool for [@digital-alchemy/hass](/docs/home-automation/hass), providing extremely detailed types for your editor to provide back to you.
The generated code has no effect during runtime, and can be as out of date as you feel like.

Nobody likes out of date types though, and you can use this script to keep them up to date as your automation system grows.

![editor](/img/editor.png)

### 📺 How custom definitions present

Pictures really only tell half the story, here is the editing experience in VSCode using the types provided by the library.
See the Intellisense in action

<ReactPlayer playing controls url='/intro.mp4' playing={false} />

## 🚀 Usage

```bash
# install to devDependencies
npm i --save-dev @digital-alchemy/type-writer
# run
npx type-writer
```

![command](/img/command.png)

If you are running your code within a Home Assistant addon environment, `type-writer` will automatically connect to your install. No configuration needed!

## ⚙️ Configuration

For setups outside an addon environment, a configuration file is needed. Create one of the following:

> config file: `.type_writer` or `~/.config/type_writer`

```ini
[hass]
  BASE_URL=http://localhost:8123
  TOKEN=... # YOUR LONG LIVED ACCESS TOKEN
```

## 📠 Output

> ⚠️ You should consider 100% of this output of this script as private information ⚠️

Type writer will take LARGE quantities of information about your setup and writes them to a type definitions file tp be consumed by `hass`.
Every section of the file has the potential for identifying details about your setup.

- entity state details
- service calling interfaces
- arrangement of entities relative to labels / areas / devices / platforms / etc
- pre calculated definitions for editor optimizations
- limited details about some scripts / blueprints / automations available for calling

If you are curious to see the script output, you can write it to a local file like this

```bash
npx type-writer --TARGET_FILE ./output.d.ts
```
