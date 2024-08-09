---
title: Backup Coordinator
authors: [zoe-codez]
sidebar_position: 1
---

> ⚠️ Experimental project

## Overview

The backup coordinator project is a `digital-alchemy` based wrapper for [BorgBackup](https://borgbackup.readthedocs.io/en/stable), allowing for easy scheduled deduplicated backups of devices across your network.
This project brings convenient bindings to Home Assistant via a `synapse` backed application

## Basic Usage

This project ships with 2 major components:

1. `drone`: a wrapper for `borg` deployed to each target machine
2. `backup_coordinator`: a coordinator service for drone when to backup / offsite

Both portions of the project can be ran as either a standalone application or as an imported library/module for a larger app

### Backup Drones

Backup drones are the portion of the project that handles interactions with `borg` itself. It exposes entities for:

> See [install](/docs/side-projects/backup-coordinator/install.md) guide for configuration details

| Entity Type | Name | Description |
| --- | --- | --- |
| `number` | Backup Frequency | (minutes) Used by coordinator to schedule backups |
| `button` | Create Backup | Create a new backup |
| `button` | Prune Backups | Prune old archives according to rules |
| `button` | Update Stats | Update archive stats sensors |
| `button` | Scheduled Backup | Run a scheduled backup, includes `create`, `prune`, `stats` |
| `sensor` | Application State | The current operation being performed. `idle` by default |
| `select` | Application Mode | Should this app be considered by the coordinator app |
| `sensor` | Last Prune | Timestamp of the last completed prune |
| `sensor` | Last Backup | Timestamp of the last completed backup |
| `sensor` | Archive Total Size | Total size of data in archive |
| `sensor` | Archive Compressed Size | Archive size after compression |
| `sensor` | Archive Deduplicated Size | Archive size after deduplication |
| `number` | Keep Monthly | Refer to [borg docs](https://borgbackup.readthedocs.io/en/stable/usage/prune.html) |
| `number` | Keep Yearly | Refer to [borg docs](https://borgbackup.readthedocs.io/en/stable/usage/prune.html) |
| `number` | Keep Weekly | Refer to [borg docs](https://borgbackup.readthedocs.io/en/stable/usage/prune.html) |
| `text` | Keep Within | Keep all backups inside this time range |

| ![on a dashboard](/img/backup_drone.png) | Multiple Backup Devices on Dashboard |
| --- | --- |

While performing create operations, process updates will be emitted via Home Assistant events.
The coordinator app is set up to receive this and centrally present information about the in-progress update.

This app is intended to run on the target machine needing backups

### Coordinator

The coordinator app exists to coordinate the various

- failure detection
- round robin scheduler
- progress watcher entities
