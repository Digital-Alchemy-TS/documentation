---
aliases:
  - Type-Writer
---

## 📝 Description

Welcome to `@digital-alchemy/type-writer`!

- [[Type Writer 0.3.x|0.3.x changelog]]

This application is a support tool for [[Hass Overview|@digital-alchemy/hass]], providing a detailed description of your setup for your editor to take advantage of. This is strictly a development tool, aimed at enhancing the editor experience.

This script should be run after updating dependencies, any time you alter your setup, right before you open your editor, or whenever you feel like it. Nobody is judging.

![[editor.png]]

### 📺 How custom definitions present

Pictures really only tell half the story, here is the editing experience in VSCode. See the Intellisense in action

![[intro.mp4]]

## 🚀 Usage
```bash
# install to devDependencies
npm i --save-dev @digital-alchemy/type-writer
# run
npx type-writer
```
![[command.png]]

If you are running your code within a Home Assistant addon environment, `type-writer` will automatically connect to your install. No configuration needed!

## ⚙️ Configuration

> [!tip]
> Curious to see the output? Provide a [[TARGET_FILE]]

For setups outside an addon environment, a configuration file is needed. Create one of the following:
- `.type_writer`: add to project root
- `~/.config/type_writer`: add to user configs

**Contents:**
- [[Home Automation/Hass/config/BASE_URL|BASE_URL]]
- [[Home Automation/Hass/config/TOKEN|TOKEN]]
```ini
[hass]
  BASE_URL=http://localhost:8123 
  TOKEN=... # YOUR LONG LIVED ACCESS TOKEN
```
