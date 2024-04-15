## 📜 Description

Configuration options for the MQTT client, as defined by the `IClientOptions` interface from the mqtt npm package. This includes settings such as host, password (use `null` for undefined), and port. Given the configuration system's limitations with nested structures, the entire object must be provided as a JSON string when using environment variables or CLI switches. For file-based configurations, nested properties can be directly specified.

- **type**: `internal`
- required: `false`
- default: `{"host": "localhost", "password": null, "port": 1883}`
- project: [MQTT](/support-libraries/mqtt)

> **Note**:
> You can see the full type definition [on GitHub](https://github.com/mqttjs/MQTT.js/blob/9a18610daf7b350476c1d92347dc24f56882887b/src/lib/client.ts#L111)

### 💡 Example Usage

### 🌍 Environment

> Set up as an environment variable for your shell, then run the script
```bash
export CLIENT_OPTIONS='{"host": "localhost", "password": null, "port": 1883}'
tsx src/main.ts
```
> Set up as an environment variable for just the single run

```bash
CLIENT_OPTIONS='{"host": "localhost", "password": null, "port": 1883}' tsx src/main.ts
```

### 🎛️ CLI Switch

> Provide your config as a serialized JSON string via a CLI switch
```bash
tsx src/main.ts --client_options='{"host": "localhost", "password": null, "port": 1883}'
```

### 📁 File
>  If your file does not have an extension, [Configuration](/core/configuration) will do auto
#### 📘 ini

> `.my_app_name`, `~/.config/my_app_name`

```ini
[mqtt.CLIENT_OPTIONS]
host=localhost
password=  # Use this format for null or undefined
port=1883
```
#### 📄 yaml

> `.my_app_name.yaml`

```yaml
mqtt:
  CLIENT_OPTIONS:
    host: "localhost"
    password: null  # YAML supports null explicitly
    port: 1883
```
### 🗃️ json

> `.my_app_name.json`

```json
{
  "mqtt": {
    "CLIENT_OPTIONS": {
      "host": "localhost",
      "password": null,  // Use null for undefined values
      "port": 1883
    }
  }
}
```
