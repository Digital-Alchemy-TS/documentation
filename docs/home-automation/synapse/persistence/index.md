---
title: Persistence
id: synapse-persistence
sidebar_position: 5
---

In addition to synchronizing state with Home Assistant, `synapse` also tracks state in a local database.
This information allows the library to:

- when you reboot your application, entities restore `state` / `attribute` / `locals` to the last known state
- detect when significant changes happen to an entity

## Backends

Synapse has support for multiple backends that you are able to pick between based on project needs / preferences.
You can set this via the `.bootstrap` call in your app, or by the appropriate environment variable.

> ℹ️ You may reset the backend at any time without serious consequence (aside from loss of current entity state)

#### environment variable

```
# valid values: sqlite | postgresql | mysql
SYNAPSE_DATABASE_TYPE=sqlite
```

#### application bootstrap

```typescript
import { HOME_AUTOMATION } from "./application.module.mts";

HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      METADATA_UNIQUE_ID: "f4f75495-8928-4f8d-895b-22fbef47f549"
      // any unique value works ^^^^^^^^
    }
  }
})
```

### SQLite

The default backend is `sqlite`, requiring no additional dependencies for your application.

By default it will write to file storage, but may be configured to use in-memory storage for situations like unit testing.

| Location Type | Example Filename | Description |
| :--- | :--- | :--- |
| **Standard Disk File** | `my_data.db` or `/home/user/app.db` | A regular path (relative or absolute) to a file on disk. |
| **In-Memory (Private)** | `:memory:` | A database that exists only in RAM and is private to the connection. It vanishes when the connection is closed. |
| **Temporary Disk File** | `""` (empty string) | A transient database created in a temporary file on disk. It is automatically deleted when the connection closes. |
| **URI Filename** | `file:path/to/db?mode=ro` | Used to pass options (query parameters) to the open operation. The path can be relative, absolute, or a special identifier. |
| **In-Memory (Shareable)** | `file::memory:?cache=shared` or `file:memdb1?mode=memory&cache=shared` | A named or unnamed in-memory database that can be shared across multiple connections within the same process. |

#### as environment variables

```
SYNAPSE_DATABASE_TYPE=sqlite
SYNAPSE_DATABASE_URL=file:./synapse_storage.sql
```

#### via bootstrap

```typescript
HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      SYNAPSE_DATABASE_TYPE: "sqlite",
      SYNAPSE_DATABASE_URL: ":memory:",
    }
  }
})
```

### PostgreSQL

PostgreSQL is a production-ready relational database backend. It requires a running PostgreSQL instance and appropriate connection credentials.

#### docker-compose example

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: synapse
      POSTGRES_PASSWORD: super_secret_password
      POSTGRES_DB: synapse
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### as environment variables

```
SYNAPSE_DATABASE_TYPE=postgresql
SYNAPSE_DATABASE_URL=postgresql://synapse:super_secret_password@localhost:5432/synapse
```

#### via bootstrap

```typescript
HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      SYNAPSE_DATABASE_TYPE: "postgresql",
      SYNAPSE_DATABASE_URL: "postgresql://synapse:super_secret_password@localhost:5432/synapse",
    }
  }
})
```

### MySQL

MySQL (and MariaDB) is an alternative relational database backend. It requires a running MySQL instance and appropriate connection credentials.

#### docker-compose example

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_USER: synapse
      MYSQL_PASSWORD: super_secret_password
      MYSQL_DATABASE: synapse
      MYSQL_ROOT_PASSWORD: super_secret_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

#### as environment variables

```
SYNAPSE_DATABASE_TYPE=mysql
SYNAPSE_DATABASE_URL=mysql://synapse:super_secret_password@localhost:3306/synapse
```

#### via bootstrap

```typescript
HOME_AUTOMATION.bootstrap({
  configuration: {
    synapse: {
      SYNAPSE_DATABASE_TYPE: "mysql",
      SYNAPSE_DATABASE_URL: "mysql://synapse:super_secret_password@localhost:3306/synapse",
    }
  }
})
```
