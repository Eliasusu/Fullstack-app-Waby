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
pnpm install              # instala todos los paquetes (un solo pnpm-lock.yaml en la raíz)
pnpm dev:shared           # recompila @waby/shared al guardar (dejalo corriendo si tocás el contrato)
pnpm dev:api              # API en modo watch (http://localhost:3000)
pnpm dev:client           # front con Vite (http://localhost:5173)
pnpm typecheck            # tsc --noEmit en todos los paquetes
pnpm lint                 # ESLint del client
pnpm build                # build de todos los paquetes
pnpm --filter @waby/api add <pkg>   # agregar una dependencia a un paquete
```

La base de datos de desarrollo es MySQL 8. En `dump/` hay un dump de octubre de 2024 con datos de ejemplo.

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
- Backend organizado por feature (`users/`, `exercises/`, `trainings/`...), cada una con `*.entity.ts`, `*.schema.ts` (Zod), `*.controllers.ts` y `*.routes.ts`.
- Imports en la API con extensión `.js` (ESM en Node).
- En el client, alias `@/` apunta a `client/src/`.
- Tipos y validaciones de lo que viaja entre la API y el client se importan de `@waby/shared`. No se redefinen entidades en `api/` ni en `client/`. Si cambia la forma de un request o una respuesta, se cambia en `shared/` primero.
