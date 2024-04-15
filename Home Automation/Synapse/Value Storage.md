---
library: "[[Synapse Overview|Synapse]]"
---
## Overview

Synapse will attempt to store and load values through a variety of methods in order to better restore application state on reboot. Each comes with tradeoffs, allowing you to choose the method that best matches your application's needs

## Storage Methods

- **See configuration**: [[STORAGE]]

### None

### Cache

### File

This will store raw data related to your entities within the file system. Each entity gets it's own file.

### External