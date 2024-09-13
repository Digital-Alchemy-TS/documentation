---
title: 🧺 AsyncLocalStorage
sidebar_position: 1
description: "Library cache interfaces"
---

The cache extension provides a basic configurable caching interface, using a memory cache by default, with built in support for Redis.

## Methods

- get
- set
- delete
- keys

## Key Prefixes

The `boilerplate.CACHE_PREFIX` configuration takes in strings, and will be prefixed in front of all keys for the cache.
If you are using redis, this can serve as a method preventing cache key collisions between applications using a shared redis.
