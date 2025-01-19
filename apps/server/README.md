# Server

Server hosts the TRPC router that Coatrack uses to synchronize data.

# Configuration

Configuration is achieved via environment variables.

| Variable Name                 | Description                          | Default Value                   |
| ----------------------------- | ------------------------------------ | ------------------------------- |
| `COATRACK_DATA_DIR`           | Directory where Coatrack stores data | Docker: `/data` Standalone: `.` |
| `COATRACK_APP_HOST_PORT_LOW`  | App host port range lower bound      | 40000                           |
| `COATRACK_APP_HOST_PORT_HIGH` | App host port range higher bound     | Docker: 41000 Standalone: 50000 |
