---
title: Backup
id: hass-backup
sidebar_position: 1
---

The backup service contains utilities for interacting with the Home Assistant backup system.

| method     | description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `download` | Provide a download hash + path to save to, will download backup zip to location |
| `generate` | Start a new backup, returns when backup is complete                             |
| `list`     | List all backups                                                                |
| `remove`   | Delete a backup                                                                 |
