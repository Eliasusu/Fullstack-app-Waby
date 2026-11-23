# Tests de Waby

Qué suites hay, cómo se corren y la evidencia de la última corrida. Todos los comandos van desde la raíz del repo.

## Suites

| Suite | Dónde | Herramienta | Qué cubre |
|---|---|---|---|
| Integración de la API | `api/test/*.test.ts` | `node:test` | Levantan la API en un puerto libre y le pegan por HTTP contra la base `waby_test`, que se borra y se recrea en cada archivo. Cubren auth y usuarios, catálogos, Ejercicios, Entrenamientos y Metas, incluidos los permisos (un recurso ajeno responde 404, los catálogos solo los edita un Admin). |
| Unitarios de la API | `api/test/jwt.test.ts` | `node:test` | Prueban funciones sueltas sin levantar la API ni tocar la base, por ejemplo la verificación del token de sesión. Corren junto con los de integración. |
| Client | `client/src/**/*.test.{ts,tsx}` | Vitest + Testing Library (jsdom) | Componentes y utilidades del front, con la zona horaria fija para que las fechas den igual en cualquier máquina. |
| End-to-end | `e2e/tests/` | Playwright + testcontainers | Smoke tests en Chromium sobre la app real: client compilado, API y un MySQL efímero. Detalle en [`e2e/README.md`](../e2e/README.md). |

## Comandos

```bash
pnpm test              # API: integración y unitarios
pnpm test:client       # client: Vitest
pnpm test:e2e          # end-to-end: Playwright
```

`pnpm typecheck` y `pnpm lint` no son tests, pero se corren junto con ellos antes de entregar.

## Requisitos

- **`pnpm test`**: MySQL arriba (`pnpm db:up`) y el `.env` de la raíz completo. Fuerza `NODE_ENV=test`, así que usa la base `DB_TEST_NAME` (`waby_test`) y nunca toca la de desarrollo.
- **`pnpm test:client`**: nada más que `pnpm install`. No usa la API ni la base.
- **`pnpm test:e2e`**: Docker corriendo y Node ≥ 22.22 en el sistema (por `testcontainers`). La primera vez, `pnpm --filter @waby/e2e exec playwright install chromium`. No necesita `pnpm db:up` ni `.env`.

## Evidencia de la última corrida

Se completa sobre el commit de entrega, con la salida real de cada comando. Formato:

```text
Fecha:  AAAA-MM-DD
Commit: <hash corto> (<rama>)

$ pnpm test
<resumen de node:test: tests, suites, pass, fail>

$ pnpm test:client
<resumen de Vitest: archivos y tests>

$ pnpm test:e2e
<resumen de Playwright: passed, failed, duración>
```

Todavía no hay corrida registrada.
