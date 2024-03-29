## Overview

This project details the construction of Pi Matrix compatible hardware, and provides the software to do the rendering (coming soon)


> Links provided for easy to find product reference, project can be made much more cost efficiently
>
> Items marked as optional if they can be easily worked around with


> [!warning]
> This build requires some hand wiring and interacting with wires that contains high voltage. This is **not** an introductory guide, 

## Hardware

### Controller (v3)

| Front         | ![[front.jpg]]  |
| ------------- | --------------- |
| ![[side.jpg]] | Side            |
| Look good! 💅 | ![[willow.jpg]] |
### Parts


### Odds and ends

| Name         | Purchase Link                                  | Required | Notes                                                       | Image                 |
| ------------ | ---------------------------------------------- | -------- | ----------------------------------------------------------- | --------------------- |
| Power Supply | [Amazon](https://www.amazon.com/dp/B06XK2DDW4) | Y        | Any 5V power source should be fine with sufficient amperage | ![[power_supply.jpg]] |
- Power cord
- Hot glue (sanity)
- Zip tie (sanity)
- Wire nuts (power)
- Extra wire (power)
- [SD card](https://www.amazon.com/dp/B08KSSX9PH)
- Metallic sharpie (marking aluminum)
- Hacksaw (cutting extruded aluminum)
- Clear nail polish (coat any labels written with sharpie)

## Controller Construction

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Raspberry Pi 4 | n/a                                                    | Y        |                                                                                                                                      |                       |
| Cooling / case | [Amazon](https://www.amazon.com/dp/B07VD568FB)         | N        | This one is very solid, and is great for keeping things contained. Version 1 uses a different cooler (see magnetic mounting section) | ![[case.jpg]]         |
| USB Speaker    | [Amazon](https://www.amazon.com/gp/product/B075M7FHM1) | N        | Used for audio alerts                                                                                                                | ![[speaker.jpg]]      |
| Ribbon Cable   | [Amazon](https://www.amazon.com/dp/B07D991KMR)         | N        | For orgnization. Can use jumpers to go from device directly to 16 pin cable if desired                                               | ![[ribbon_cable.jpg]] |

## Matrix Contruction

The matrix is made up of 2 layers: the aluminum frame, and the rgb matrix panel.
### Frame
Diving into the frame first, this acts as the skeleton for the panel grid. Fortunately, it's pretty straight forward

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Dual extruded aluminum   | [Amazon](https://www.amazon.com/gp/product/B08X4PB5GC) | Y        | Structural                                                                                                 | ![[dual_aluminum.jpg]]      |
| Single extruded aluminum | [Amazon](https://www.amazon.com/gp/product/B087PVD55Y) | Y        | Structural                                                                                                 | ![[single_aluminum.jpg]]    |
| Corner bracket           | [Amazon](https://www.amazon.com/gp/product/B0855V2JV3) | Y        | Structural                                                                                                 | ![[corner_bracket.jpg]]     |
| End Cap                  | [Amazon](https://www.amazon.com/gp/product/B09JS8L4XT) | N        | Aesthetics                                                                                                 | ![[end_cap.jpg]]            |
| Slot cover               | [Amazon](https://www.amazon.com/gp/product/B09KPZBTB9) | N        | Aesthetics                                                                                                 | ![[slot_cover.jpg]]         |


| Corner bracket joins   | Dry fitting           |
| ---------------------- | --------------------- |
| ![[aluminum_join.jpg]] | ![[construction.jpg]] |

### Assembly

#### Interface

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Countersunk Magnets      | [Amazon](https://www.amazon.com/gp/product/B0816HQ5RD) | Y        | Magnetic mount                                                                                             | ![[countersunk_magnet.jpg]] |
| M3 screw                 | [Amazon](https://www.amazon.com/gp/product/B018RSXQ02) | Y        | Magnetic mount                                                                                             | ![[m3_screw.jpg]]           |
| M3 washers               | [Amazon](https://www.amazon.com/gp/product/B07WST3YJJ) | Y        | Magnetic mount                                                                                             | ![[m3_washer.jpg]]          |
| M3 T-nut                 | [Amazon](https://www.amazon.com/gp/product/B08NZMD2BJ) | Y        | Magnetic mount                                                                                             | ![[m3_t_nut.jpg]]           |
| M3 standoff              | [Amazon](https://www.amazon.com/dp/B07WR5Q2SY)         | Y        | Magnetic mount                                                                                             | ![[m3_standoff.jpg]]        |

#### Display

| Name           | Purchase Link                                          | Required | Notes                                                                                                                                | Image                 |
| -------------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Cable connector          | [Amazon](https://www.amazon.com/gp/product/B07WHFWMYQ) | N        | Extra cable needed for laying out matrix in grid                                                           | ![[cable_connector.jpg]]    |
| Extra ribbon cable       | [Amazon](https://www.amazon.com/gp/product/B07PBGVCNL) | N        | Extra cable needed for laying out matrix in grid                                                           | ![[ribbon_cable_long.jpg]]  |
| Ribbon connectors        | [Amazon](https://www.amazon.com/gp/product/B00E57QQVG) | N        | Extra cable needed for laying out matrix in grid                                                           | ![[ribbon_connector.jpg]]   |
| RGB matrix               | [Adafruit](https://www.adafruit.com/product/2278)      | Y        | Anything compatible with [hzeller/rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix)       | ![[rgb_matrix.jpg]]         |
| Matrix bonnet            | [Adafruit](https://www.adafruit.com/product/3211)      | N        | Can adapt from 40 pin cable to the 16 + additional uses                                                    | ![[matrix_bonnet.jpg]]      |


| Completed prototype hardware | Completed frame   |
| ---------------------------- | ----------------- |
| ![[prototype.jpg]]           | ![[backside.jpg]] |

### It's Alive!!!
![[party_parrot.gif]]


### Magnetic mounts

**On the frame side**
- The mount is made from a T-nut, with a standoff threaded into it through a washer.
- A magnet is screwed into the top of the standoff.

On the rgb matrix, the magnet can simply be screwed into the panel.

Keep an eye on the polarity & orientation of the magnets.
Not all magnets are polarized the same, and it is important to not have both countersunk sides on the inside (screws contact at interface).

| Magnet interface     | Frame side mount     |
| -------------------- | -------------------- |
| ![[frame_mount.jpg]] | ![[panel_mount.jpg]] |

### Attached controller

The controller can also be attached to the frame via a similar mechanism

| Name | Purchase Link | Notes |
| --- | --- | --- |
| Heat sink | [Amazon](https://www.amazon.com/gp/product/B07PCMTZHF) | Removed fan, passive cooling is enough |
| Power Cord | [Amazon](https://www.amazon.com/gp/product/B07V2CKPLG) | For a clean look |

| ![[magnetic_pi_mount.jpg]] | Side mount |
| -------------------------- | ---------- |
|                            |            |
