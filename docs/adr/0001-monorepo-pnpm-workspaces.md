# ADR-0001: Monorepo con pnpm workspaces

- **Estado**: Aceptado
- **Fecha**: 2026-10-30
- **Autores**: Elias Palamidessi

## Contexto

`api/` y `client/` eran dos proyectos sueltos, cada uno con su propio `pnpm-lock.yaml` (uno en formato v6 y otro en v9), los dos con `"name": "waby"`, y con un tercer lockfile desactualizado en la raíz. Para instalar o correr algo había que entrar a cada carpeta.

## Decisión

Usar **pnpm workspaces** con un `package.json` y un único `pnpm-lock.yaml` en la raíz. Los paquetes se llaman `@waby/api` y `@waby/client`. La versión de pnpm queda fijada en `packageManager` (pnpm 9).

## Alternativas consideradas

- **npm workspaces**: Waby ya venía con pnpm y sus lockfiles; cambiar de gestor no aporta nada para la entrega.
- **Dejar los proyectos separados**: más simple hoy, pero complica el CI y compartir código entre paquetes.

## Consecuencias

- Todo se instala y se corre desde la raíz (`pnpm install`, `pnpm dev:api`, `pnpm typecheck`).
- Las versiones declaradas en los `package.json` no cambiaron. Las dependencias con rango (`^`) se resolvieron de nuevo al regenerar el lockfile, así que algunas pueden haber subido de patch o minor dentro de su rango.
- Sumar un paquete nuevo es agregar su carpeta al `pnpm-workspace.yaml`.
