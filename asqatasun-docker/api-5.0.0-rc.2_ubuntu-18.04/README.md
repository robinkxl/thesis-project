# Launch Asqatasun `5.0.0-rc.2` API

> ⚠️ Created for testing purpose only, no security has been made for production. ⚠️

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) `19.03.0` (at least) is required
- [Docker Compose](https://docs.docker.com/compose/install/) `1.27.0` (at least) is required

## Ports, URL and credentials (user/password)

| Service  | Port | URL                                     | User                         | Password                        |
|----------|------|-----------------------------------------|------------------------------|---------------------------------|
| Database | 3306 | `jdbc:mysql://localhost:3306/asqatasun` | `asqatasunDatabaseUserLogin` | `asqatasunDatabaseUserP4ssword` |
| API      | 8081 | `http://localhost:8081`                 | `admin@asqatasun.org`        | `myAsqaPassword`                |

Tip:
if you copy [`.env.dist`](.env.dist) file to `.env` file,
you can change **port** numbers, **IP** adresses and **database** credentials.

## Software versions

- Asqatasun **5.0.0-rc.2**
- Geckodriver **0.32.2**
- Firefox **102.8.0esr**

## Launch Asqatasun

```shell
docker-compose up --build
```

## Play with Asqatasun API

- In your browser: `http://127.0.0.1:8081/`  (API documentation and **Swagger** playground)
- Use this user and this password to log in:
  - `admin@asqatasun.org`
  - `myAsqaPassword`

You can refer to [Asqatasun API documentation](https://doc.asqatasun.org/v5/en/Developer/API/)
for full usage and tips on how to use it.
