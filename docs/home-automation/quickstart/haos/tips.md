---
title: 💡 Tips
---

## Tips and Tricks

### Syncthing

> Syncthing is a continuous file synchronization program in a de-centralized way.
>
> Visit the [Syncthing](https://github.com/Poeschl/Hassio-Addons/tree/main/syncthing) page for more details

Syncthing is a fantastic tool for synchronizing source code between a development machine and Home Assistant.
There are a few recommended changes to a default setup to prevent issues within the workspace.

#### .stignore

Unless it's been told otherwise, syncthing will attempt to synchronize your `node_modules` between machines.
This can lead to some unintended interactions, and it is recommended for each machine to install it's own dependencies.

The quickstart project comes with a `.stignore` file by default, which has been set up with the appropriate ignore pattern.

#### Sync Conflicts

Another issue that can arise from syncthing under some circumstances is sync conflicts.
These result in the generation of extra files in your code, which can cause headaches in tracking down.

Setting the [maxConflicts](https://docs.syncthing.net/v1.19.2/users/config#config-option-folder.maxconflicts) configuration to `0` will disable the feature.

![ui location](/img/syncthing_conflict.png)
