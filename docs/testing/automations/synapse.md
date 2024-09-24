---
title: 🧠 Synapse
---

> ⚠️ Synapse testing tools are under active development
>
> If things aren't working as expected, or you want to perform more / different operations than are currently supported, please open an issue.

Testing `@digital-alchemy/synapse` is pretty straightforward, tools are intended to operate as expected for setting up spies.

## LIB_MOCK_SYNAPSE

An additional helper library is provided to help make sure the parent `synapse` library is set up for tests in a valid way.

- provide a new default database (don't conflict with a real sqlite db)
- disable certain events that are not needed for tests
- provide the required flags to make synapse identify as installed & configured (or not)
