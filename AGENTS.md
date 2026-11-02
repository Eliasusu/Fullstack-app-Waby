# AGENTS.md

Instrucciones para agentes de código (Claude Code, Codex, Copilot, etc.) en el repo de Waby. Leelo completo antes de tocar código.

## El proyecto

Monorepo con **pnpm workspaces**:

| Paquete | Carpeta | Stack |
|---|---|---|
| `@waby/shared` | `shared/` | Contrato de la API: esquemas Zod, tipos y enums que usan la API y el client (ADR-0002) |
| `@waby/api` | `api/` | Node + Express 4 + TypeScript, MikroORM 5 sobre MySQL |
| `@waby/client` | `client/` | React 18 + Vite 5 + TypeScript, Tailwind + shadcn/ui, React Router 6 |

- Glosario y modelo de dominio: `CONTEXT.md`.
- Decisiones de arquitectura: `docs/adr/`.
- Investigaciones y análisis: `docs/research/`.

## Comandos (desde la raíz)

```bash
cp .env.example .env      # la primera vez: completar valores (JWT_SECRET, contraseñas)
docker compose up -d      # MySQL 8 con las bases waby (desarrollo) y waby_test (tests)
pnpm install              # instala todos los paquetes (un solo pnpm-lock.yaml en la raíz)
pnpm dev:shared           # recompila @waby/shared al guardar (dejalo corriendo si tocás el contrato)
pnpm dev:api              # API en modo watch (http://localhost:3000)
pnpm dev:client           # front con Vite (http://localhost:5173)
pnpm typecheck            # tsc --noEmit en todos los paquetes
pnpm lint                 # ESLint del client
pnpm build                # build de todos los paquetes
pnpm test                 # tests de integración de la API contra waby_test (borra y recrea esa base)
pnpm seed                 # borra y recrea la base waby con datos de demo (usuarios admin y demo, ver .env)
pnpm --filter @waby/api add <pkg>   # agregar una dependencia a un paquete
```

La base de datos es MySQL 8 y la levanta `docker-compose.yml` con los valores de `.env`. En desarrollo, la API actualiza el esquema al arrancar (`updateSchema`, sin migraciones: ADR-0003). Los dumps de `dump/` son del modelo viejo y ya no sirven.

Los scripts de `api/` corren con el Node 22 que instala la devDependency `node`. Con Node 26, `jsonwebtoken` no carga (`SlowBuffer`), así que no corras `node dist/index.js` a mano: usá los scripts de pnpm.

## Reglas

- **No cambiar versiones de dependencias** sin un issue o un ADR que lo justifique. El objetivo de Waby 1.0 es terminar lo que hay, no actualizar el stack.
- **Un solo lockfile** en la raíz. No crear `package-lock.json` ni lockfiles dentro de los paquetes.
- **Nada de secretos en el código**: credenciales de base de datos y claves de JWT van en `.env` (ignorado por git).
- **Alcance**: antes de agregar una feature, dependencia o refactor grande, preguntá. La prioridad es dejar Waby 1.0 listo para la cátedra.
- **Términos de dominio**: usá los de `CONTEXT.md`. Si aparece un término nuevo, proponé agregarlo ahí.
- **Decisiones**: si algo contradice un ADR, proponé un ADR nuevo que lo reemplace; no lo cambies en silencio.

## Convenciones

- Código e identificadores en inglés. Docs, issues y textos de la UI en español.
- Commits con Conventional Commits y scope: `fix(api): ...`, `feat(client): ...`, `chore: ...`, `docs: ...`.
- Backend organizado por feature (`users/`, `exercises/`, `trainings/`...), cada una con:
  - `*.entity.ts`: entidad de MikroORM.
  - `*.mapper.ts`: entidad → respuesta con la forma del contrato de `@waby/shared`.
  - `*.service.ts` (si hace falta): búsquedas compartidas, por ejemplo `findOwnExercise`.
  - `*.controllers.ts` y `*.routes.ts`. Los handlers van envueltos en `asyncHandler`, y los errores se tiran (`notFound`, `conflict`, `invalid`) para que los traduzca `errorHandler` (`api/shared/http.ts`).
- La validación usa los esquemas de `@waby/shared`. No hay `*.schema.ts` en la API.
- Propiedad: toda consulta de datos de usuario filtra por `currentUserId(req)`. Un recurso ajeno responde 404.
- Contrato de la API: `docs/api.md`. Cada cambio de endpoint actualiza ese archivo y los tests de `api/test/`.
- Imports en la API con extensión `.js` (ESM en Node).
- En el client, alias `@/` apunta a `client/src/`.
- Tipos y validaciones de lo que viaja entre la API y el client se importan de `@waby/shared`. No se redefinen entidades en `api/` ni en `client/`. Si cambia la forma de un request o una respuesta, se cambia en `shared/` primero.
