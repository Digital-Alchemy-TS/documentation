---
title: 📦 Deployments
---

The standalone project supports a variety of methods for running code long term.
Which method of running depends on personal preferences, below is some potential options.

## PM2

- https://pm2.keymetrics.io/

> PM2 is a daemon process manager that will help you manage and keep your application online 24/7


The standalone quickstart project comes with a pre-configured pm2 ecosystem file.

```bash
yarn build
pm2 start pm2.ecosystem.js
```

## Docker

> todo
