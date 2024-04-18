---
title: Matrix Rendering/Hardware Build Guide
---
## Overview

This project details the construction of [Pi Matrix](/matrix-rendering) compatible hardware, and provides the software to do the rendering (coming soon)

> Links provided for easy to find product reference, project can be made much more cost efficiently
>
> Items marked as optional if they can be easily worked around with
>
> **Warning**:
> This build requires some hand wiring and interacting with wires that contains high voltage. This is **not** an introductory guide,

## Hardware

### Controller (v3)

#### Completed build pics

| Front         | Side           |
| ------------- | -------------- |
| ![side](/img/side.jpg) | ![front](/img/front.jpg) |

#### Parts list

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Raspberry Pi 4 | n/a                                                    | Y        |                                                                                                                                      |    **----**            |
| Cooling / case | [Amazon](https://www.amazon.com/dp/B07VD568FB)         | N        | This one is very solid, and is great for keeping things contained. Version 1 uses a different cooler (see magnetic mounting section) | ![case](/img/case.jpg)         |
| USB Speaker    | [Amazon](https://www.amazon.com/gp/product/B075M7FHM1) | N        | Used for audio alerts                                                                                                                | ![speaker](/img/speaker.jpg)      |
| Ribbon Cable   | [Amazon](https://www.amazon.com/dp/B07D991KMR)         | N        | For orgnization. Can use jumpers to go from device directly to 16 pin cable if desired                                               | ![ribbon_cable](/img/ribbon_cable.jpg) |

#### 💅 Look good

>
> Highly recommended step: break out the metallic markers! 🎨

![willow](/img/willow.jpg)

### 🧺 Odds and ends

Random odds and ends used in the build.

| Name         | Purchase Link                                  | Required | Notes                                                       | Image                 |
| ------------ | ---------------------------------------------- | -------- | ----------------------------------------------------------- | --------------------- |
| Power Supply | [Amazon](https://www.amazon.com/dp/B06XK2DDW4) | Y        | Any 5V power source should be fine with sufficient amperage | ![power_supply](/img/power_supply.jpg) |
| SD Card      | --                                             |          | You need some boot device                                   |                       |

- Power cord
- Hot glue
- Zip ties
- Velcro ties
- Wire nuts / wago connectors
- Network cable
- Independent power supply for Raspberry Pi
- Extra wire
- Hacksaw

## 🚦 Display Construction

The matrix is made up of 2 layers: the aluminum frame, and the rgb matrix display. Magnets on standoffs are used to provide a hot swap friendly connection

### 🏗️ Frame

The frame is a fairly straightforward build. The dual channel aluminum isn't technically needed, but I personally enjoy the aesthetics with the slot clovers in the final build

| Corner bracket joins   | Dry fitting           |
| ---------------------- | --------------------- |
| ![aluminum_join](/img/aluminum_join.jpg) | ![construction](/img/construction.jpg) |

#### Frame parts list

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Dual extruded aluminum   | [Amazon](https://www.amazon.com/gp/product/B08X4PB5GC) | Y        | Structural                                                                                                 | ![dual_aluminum](/img/dual_aluminum.jpg)      |
| Single extruded aluminum | [Amazon](https://www.amazon.com/gp/product/B087PVD55Y) | Y        | Structural                                                                                                 | ![single_aluminum](/img/single_aluminum.jpg)    |
| Corner bracket           | [Amazon](https://www.amazon.com/gp/product/B0855V2JV3) | Y        | Structural                                                                                                 | ![corner_bracket](/img/corner_bracket.jpg)     |
| End Cap                  | [Amazon](https://www.amazon.com/gp/product/B09JS8L4XT) | N        | Aesthetics                                                                                                 | ![end_cap](/img/end_cap.jpg)            |
| Slot cover               | [Amazon](https://www.amazon.com/gp/product/B09KPZBTB9) | N        | Aesthetics                                                                                                 | ![slot_cover](/img/slot_cover.jpg)         |

It's dimensions are going to be determined by the positions of the mounts on your panels. It's recommended to get at least 4 points of contact on each panel for proper stability. It's not required to get all points, and may make final assembly more difficult.

This part is a time consuming process, tweaking the individual pieces into position and locking them down.
Cutting to final dimensions should be saved for the very end of this. Once dimensions are determined, mark everything with a silver sharpie and cut to size. 🪚

### 🧲 Magnetic mounts

The panels are intended to be hot swappable, and use a mounting system intended for tool free maintenance. No fussing with screwdrivers and small parts on a ladder! 🪜

> **Warning**: Keep an eye on the polarity & orientation of the magnets!
>
> Not all magnets are polarized the same in cheap magnet sets. It is easy to get combinations where a single pair repel each other 😡
>
> ---
>
> **Washer will bend if over tightened**: Just enough to be secure is perfect

| Magnet interface     | Frame side mount     |
| -------------------- | -------------------- |
| ![frame_mount](/img/frame_mount.jpg) | ![panel_mount](/img/panel_mount.jpg) |

#### Parts list

| Name                | Purchase Link                                          | Required | Notes                                             | Image                       |
| ------------------- | ------------------------------------------------------ | -------- | ------------------------------------------------- | --------------------------- |
| Countersunk Magnets | [Amazon](https://www.amazon.com/gp/product/B0816HQ5RD) | Y        | The countersink is nice for getting a flush mount | ![countersunk_magnet](/img/countersunk_magnet.jpg) |
| M3 screw            | [Amazon](https://www.amazon.com/gp/product/B018RSXQ02) | Y        | Attaching magnets to standoffs and panels         | ![m3_screw](/img/m3_screw.jpg)           |
| M3 washers          | [Amazon](https://www.amazon.com/gp/product/B07WST3YJJ) | Y        | For clamping to frame                             | ![m3_washer](/img/m3_washer.jpg)          |
| M3 T-nut            | [Amazon](https://www.amazon.com/gp/product/B08NZMD2BJ) | Y        | Add to extruded aluminum to create sliding mounts | ![m3_t_nut](/img/m3_t_nut.jpg)           |
| M3 standoff         | [Amazon](https://www.amazon.com/dp/B07WR5Q2SY)         | Y        | Attach to t-nuts to create mount points           | ![m3_standoff](/img/m3_standoff.jpg)        |

#### 🧷 Attached controller mod

The controller can also be attached to the frame via a similar magnetic mount to the panels

| Name       | Purchase Link                                          | Notes                                               | Image                  |
| ---------- | ------------------------------------------------------ | --------------------------------------------------- | ---------------------- |
| Heat sink  | [Amazon](https://www.amazon.com/gp/product/B07PCMTZHF) | Removed fan, passive cooling is enough for use case | ![fan_heat_sync](/img/fan_heat_sync.jpg) |
| Power Cord | [Amazon](https://www.amazon.com/gp/product/B07V2CKPLG) | For a clean look                                    | ![180_cable](/img/180_cable.jpg)     |

![magnetic_pi_mount](/img/magnetic_pi_mount.jpg)

### 📱 Final Assembly

Time to finally put the display on the frame and wire it together!

The first part of this is finding a wide flat surface for the frame to lay down on when you get to the wiring phase

| Partial assembly       | Assembled Display          |
| ---------------------- | -------------------------- |
| ![display_parts](/img/display_parts.jpg) | ![display_assembled](/img/display_assembled.jpg) |

Assuming everything went to plan, then you should have a flat display with none of the panels having an obvious visual gap. Adding a bit of hot glue can help everything stay together

> Says "**hot swappable**", adds glue

| ![secured](/img/secured.jpg)                                                                    | Adding extra security to the joints                                                                                                                                               |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Power wiring | ![power_wiring](/img/power_wiring.jpg)                                                                                                                                                             |
| ![data_wiring](/img/data_wiring.jpg)                                                                | Data wiring. Gray ribbons (shipped with panels) used to join left/right sides, rainbow ribbons used to join rows -- You can see the data input for the pi in the bottom/right |
| The sacraficial power supply                                                        | ![with_supply](/img/with_supply.jpg)                                                                                                                                                              |

- Left and right joined together
- 5x`5v` out
- 5x`gnd` out

#### Parts list

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Cable connector          | [Amazon](https://www.amazon.com/gp/product/B07WHFWMYQ) | N        | Extra cable needed for laying out matrix in grid                                                           | ![cable_connector](/img/cable_connector.jpg)    |
| Extra ribbon cable       | [Amazon](https://www.amazon.com/gp/product/B07PBGVCNL) | N        | Extra cable needed for laying out matrix in grid                                                           | ![ribbon_cable_long](/img/ribbon_cable_long.jpg)  |
| Ribbon connectors        | [Amazon](https://www.amazon.com/gp/product/B00E57QQVG) | N        | Extra cable needed for laying out matrix in grid                                                           | ![ribbon_connector](/img/ribbon_connector.jpg)   |
| RGB matrix               | [Adafruit](https://www.adafruit.com/product/2278)      | Y        | Anything compatible with [hzeller/rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix)       | ![rgb_matrix](/img/rgb_matrix.jpg)         |
| Matrix bonnet            | [Adafruit](https://www.adafruit.com/product/3211)      | N        | Can adapt from 40 pin cable to the 16 + additional uses                                                    | ![matrix_bonnet](/img/matrix_bonnet.jpg)      |


> 🎉 🧟‍♀️ It's Alive!!!
>
![party_parrot](/img/party_parrot.gif)
