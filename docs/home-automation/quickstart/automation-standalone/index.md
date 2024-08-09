---
title: 🐳 Standalone
---

Welcome to the **Digital Alchemy** Home Automation quickstart project!

This repository is designed to work as a locally running development server, as well as providing options for long-term deployments.

## 🏗️ Setup

### Prerequisites

Digital Alchemy targets `node20`, which is the only required system dependency.

**Recommended workspace tools**:

- [Volta](https://volta.sh/) - Autonomously manages Node and Yarn versions.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - For packaging the application.

### Clone

Clone the repository to your local machine and change directory to the new repo:

```bash
git clone git@github.com/Digital-Alchemy-TS/automation-standalone.git

cd automation-standalone
```

### Install Dependencies

Install dependencies using Yarn:

```bash
# (optional) Enable Yarn for setups without Volta
corepack enable

# Install node_modules
yarn install
```

### Configure

Create a new `.env` file based on the template.

```bash
cp .env.template .env
```

> Default contents
```
HASS_TOKEN=LONG_LIVED_ACCESS_TOKEN
HASS_BASE_URL=http://localhost:8123
```

Then configure each variable in `.env` so that the application can connect to your HA instance.

- [Configuration system](/docs/core/configuration)
- [HASS configuration options](/docs/home-automation/hass/configuration)

## 🪄 Workspace Usage

### Management

Upgrade the version of `@digital-alchemy` libraries to the latest.

```bash
yarn upgrade
```

Update the library type definitions based on the current Home Assistant state. <sup>[docs](https://docs.digital-alchemy.app/docs/home-automation/type-writer/)</sup>

```bash
yarn type-writer
```

### Run

Run your automations locally:

```bash
# Normal start
yarn start

# Automatic reload when code changes
yarn start:watch
```
