
## Descripción del Proyecto

Waby es una aplicación web diseñada para crear rutinas. Este proyecto tiene como objetivo que el usuario pueda crear una amplia cantidad de ejercicios con los cuales pueda crear las rutinas. Está dirigido a personas con experiencia a la hora de entrenar y crear rutinas.

## Estado del Proyecto

Actualmente, el proyecto se encuentra en desarrollo

## Características

1. **Crear ejercicios**: Esta funcionalidad te permite crear libremente los ejercicios que tu quieras
2. **Crear rutinas**: En base a los ejercicios que has creado, puedes crear varios entrenamientos
3. **Planificar**: La aplicación cuenta con un calendario el cual te permite organizar tus entrenamientos
4. **Sobrecarga progresiva**: Además puedes por cada ejercicio que te interese, seguir el registro de tu último peso levantado, o repeticiones hechas


## Cómo levantar el proyecto

### Requisitos

- [Docker](https://docs.docker.com/get-docker/) con Compose v2 (`docker compose`).
- [pnpm](https://pnpm.io/) 9. Con Node instalado alcanza con `corepack enable`, que toma la versión de `package.json`.
- La API corre con su propio Node 22 (lo instala `pnpm install`), así que sirve cualquier versión de Node para pnpm.

### Pasos

```bash
cp .env.example .env   # completar JWT_SECRET (el archivo trae el comando para generarlo) y las contraseñas
pnpm install           # instala todos los paquetes
pnpm db:up             # levanta MySQL 8 en Docker y espera a que esté lista
pnpm seed              # crea la base waby con los catálogos y los usuarios de demo
pnpm dev:api           # API en http://localhost:3000
pnpm dev:client        # en otra terminal: el front en http://localhost:5173
```

Para entrar, usá los usuarios de demo que define `.env` (`SEED_DEMO_*` y `SEED_ADMIN_*`).

### Otros comandos

- `pnpm test`: tests de integración de la API (usan la base `waby_test`, que se borra y recrea).
- `pnpm db:down`: baja el contenedor de MySQL. Los datos quedan en el volumen de Docker.

El resto de los comandos y las convenciones del repo están en [`AGENTS.md`](AGENTS.md).
