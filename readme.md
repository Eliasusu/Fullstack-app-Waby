
# Waby

Waby es una app web para personas con experiencia entrenando que arman sus propios Ejercicios y Entrenamientos, los planifican en un calendario y siguen la sobrecarga progresiva.

Es **Waby 1.0**, el proyecto de la facultad (UTN FRRo) de Franco Libera y Elias Palamidessi: una API en Node + Express + MySQL y un front en React. El glosario completo está en [`CONTEXT.md`](CONTEXT.md).

## Características

1. **Biblioteca de Ejercicios**: cada Usuario crea sus Ejercicios, con Método de entrenamiento (Calistenia o Gimnasio), Grupos musculares, dificultad, patrón de movimiento (empuje, tracción, piernas o core) y forma de medir (repeticiones o segundos, para holds e isométricos).
2. **Mesociclos y Entrenamientos**: los Entrenamientos son lo planificado para un día, con sus Ítems (Ejercicio, series, reps o segundos, peso, descanso y comentario). Se agrupan en Mesociclos de Fuerza, Hipertrofia o Descarga, o quedan sueltos.
3. **Calendario**: los Entrenamientos se ven y se organizan por fecha, y se marcan como completados.
4. **Metas y sobrecarga progresiva**: una Meta fija un objetivo de reps, peso o segundos sobre un Ejercicio, con fecha de inicio y, opcionalmente, de fin. Su progreso es el mejor valor entre los Ítems completados de ese Ejercicio dentro de esas fechas.
5. **Dos niveles de acceso**: el Usuario gestiona sus propios datos y el Admin, además, los catálogos de Métodos de entrenamiento y Grupos musculares.

## Documentación

El punto de entrada de la documentación de la entrega es [`docs/README.md`](docs/README.md): API, tests, decisiones y auditorías.

## Cómo levantar el proyecto

### Requisitos

- [Docker](https://docs.docker.com/get-docker/) con Compose v2 (`docker compose`).
- [pnpm](https://pnpm.io/) 9. Con Node instalado alcanza con `corepack enable`, que toma la versión de `package.json`.
- La API corre con su propio Node 22 (lo instala `pnpm install`), así que sirve cualquier versión de Node para pnpm. Si tu Node no es 22, pnpm muestra un aviso `Unsupported engine` para `api`: se puede ignorar, los scripts usan el Node 22 de la API.

### Con un comando (Docker)

Levanta MySQL, carga los datos de demo, y arranca la API y el client en contenedores. Solo hace falta Docker; no hace falta Node ni pnpm si usás `docker compose` directo.

```bash
cp .env.example .env   # completar JWT_SECRET (el archivo trae el comando para generarlo) y las contraseñas
pnpm app:up            # o: docker compose --profile app up -d --build --wait
```

- Client: http://localhost:8080 · API: http://localhost:3000/api/v1
- Usuarios de demo: los de `.env` (`SEED_DEMO_*` y `SEED_ADMIN_*`). Se entra con el nombre de usuario, no con el email. Con el `.env.example` sin cambiar: `demo` / `cambiame-demo` y `admin` / `cambiame-admin`.
- El seed corre solo si la base está vacía, así que no pisa una base de desarrollo que ya tenga datos. Para volver a los datos de demo: `pnpm seed`.
- `pnpm app:down` baja todo. Los datos quedan en el volumen de Docker.
- Puertos: `CLIENT_PORT` y `API_PORT` en `.env` (por defecto 8080 y 3000).

### Para desarrollar

```bash
cp .env.example .env   # completar JWT_SECRET (el archivo trae el comando para generarlo) y las contraseñas
pnpm install           # instala todos los paquetes
pnpm db:up             # levanta MySQL 8 en Docker y espera a que esté lista
pnpm seed              # crea la base waby con los catálogos y los usuarios de demo
pnpm dev:api           # API en http://localhost:3000
pnpm dev:client        # en otra terminal: el front en http://localhost:5173
```

Para entrar, usá los usuarios de demo que define `.env` (`SEED_DEMO_*` y `SEED_ADMIN_*`).

El client usa la API local por defecto. Para apuntarlo a otra, copiá `client/.env.example` a `client/.env` y definí `VITE_API_URL`.

### Producción

```bash
pnpm build             # compila shared, la API y el client (client/dist)
pnpm start             # arranca la API compilada (api/dist/index.js) con el Node 22 de la API
```

`pnpm start` no compila: corré `pnpm build` (o `pnpm build:api`) antes. Toma la configuración del mismo `.env`; para producción, poné `NODE_ENV=production` (ver [Ambientes](#ambientes)). El client compilado queda en `client/dist` y se sirve como archivos estáticos.

### Otros comandos

- `pnpm db:down`: baja el contenedor de MySQL. Los datos quedan en el volumen de Docker.
- `pnpm dev:shared`: recompila `@waby/shared` al guardar, si tocás el contrato de la API.

El resto de los comandos y las convenciones del repo están en [`AGENTS.md`](AGENTS.md).

## Ambientes

La API elige el ambiente con `NODE_ENV` (en `.env`; ver `api/shared/env.ts`):

| | `development` (default) | `test` | `production` |
|---|---|---|---|
| Base de datos | `DB_NAME` (`waby`) | `DB_TEST_NAME` (`waby_test`) | `DB_NAME` |
| Esquema | se actualiza al arrancar la API (`updateSchema`) | lo recrean los tests en cada archivo | no se toca al arrancar: tiene que existir (no hay migraciones, ADR-0003) |
| Log de SQL | sí | no | no |
| Cookie de sesión | `secure: false` | `secure: false` | `secure: true` (solo viaja por HTTPS), salvo `COOKIE_SECURE=false` |
| `pnpm seed` | borra y recrea la base | — | se niega a correr |

- `pnpm test` fuerza `NODE_ENV=test` por su cuenta, así que el `.env` puede quedar en `development`.
- Los tests e2e levantan su propia base efímera y no usan ni `waby` ni `waby_test`.
- `CORS_ORIGINS` lista los orígenes del client que pueden llamar a la API con la cookie de sesión. En producción tiene que incluir la URL pública del client.

## Tests

```bash
pnpm test              # integración y unitarios de la API, contra la base waby_test (necesita pnpm db:up)
pnpm test:client       # unitarios del client con Vitest
pnpm test:e2e          # smoke tests con Playwright: client + API + MySQL efímero (necesita Docker)
pnpm typecheck         # tsc --noEmit en todos los paquetes
pnpm lint              # ESLint del client
```

Qué cubre cada suite y la evidencia de la última corrida: [`docs/tests.md`](docs/tests.md).

## Deploy

No hay deploy público: la app se entrega para correr con Docker (`pnpm app:up`, ver [Con un comando](#con-un-comando-docker)). La API corre en `NODE_ENV=production` con `COOKIE_SECURE=false`, porque se sirve por HTTP en localhost.
