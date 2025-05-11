---
title: Installation
authors: [zoe-codez]
sidebar_position: 2
---

## Borg Install

Install the correct version of borg for your system, and ensure that it's on `$PATH` for your user

- [Borg Releases](https://github.com/borgbackup/borg/releases)

```bash
> borg --version
borg 1.4.0
```

You will need to initialize a new repo by hand, below is an example command for setting creating on a remote machine.

```bash
BORG_PASSPHRASE="super_secret_password" borg init --encryption=repokey-blake2 user@hostname:/path/to/repo
```

The `BORG_PASSPHRASE` will need to be matched in the configuration for your app in order to create backups properly

## Config Files

> See [configuration](/docs/core/techniques/configuration) docs for more options for providing keys to app

Create the file `~/.config/drone_app` (or match to your application's name).

```ini
; credentials to home assistant install
[hass]
  TOKEN=long lived access token
  BASE_URL=http://homeassistant.local

; minimal configuration for module
[drone]
  BORG_PASSPHRASE=super_secret_password
  REPOSITORY=user@hostname:/path/to/repo
  ; ; example patterns to ignore
  ; EXCLUDE_PATTERNS[]=*/node_modules
  ; EXCLUDE_PATTERNS[]=*/.cache

  ; ; source paths to include (default is /home)
  ; TARGETS[]=/home

; provide an absolute path to where entity data can be kept
; 👍 same folder as this file
[synapse]
  SQLITE_DB=/path/to/sqlite.db
```

Individual folders can be ignored by creating a `.nobackup` file

```bash
cd /omit/this/path
touch .nobackup
```

## Manual Testing

Once the configuration file is created, the app can be easily run from inside the repo to see how things work

```bash
yarn start:drone
```

Each drone integrates with Home Assistant through the synapse integration.

## Real world usage

### As applications

### As modules
