# Smoke tests e2e

Recorren la app real en Chromium (client compilado + API + MySQL) para validar cambios antes de mergear. El objetivo es que la suite completa tarde menos de 3 minutos. El test del flujo completo de la demo se agrega cuando estén las pantallas de Mesociclo (#72, #78, #79).

## Correrlos

```bash
pnpm --filter @waby/e2e exec playwright install chromium   # la primera vez
pnpm test:e2e                                               # compila la API y corre la suite
pnpm --filter @waby/e2e test goals                          # solo los archivos que matchean "goals"
pnpm --filter @waby/e2e report                              # abre el reporte HTML de la última corrida
```

Necesita Docker corriendo y Node ≥ 22.22 en el sistema, por `testcontainers`. La API corre igual con el Node 22 de sus devDependencies. No hace falta `pnpm db:up` ni `.env`: la suite no toca la base de desarrollo.

Si un test falla, `e2e/test-results/` guarda el screenshot y el trace (`pnpm --filter @waby/e2e exec playwright show-trace <trace.zip>`).

## Qué levanta (`global-setup.ts`)

1. **MySQL 8 efímero** con testcontainers, con los datos en `tmpfs`. Se descarta al terminar.
2. **Seed de demo** (`api/dist/scripts/seed.js`) contra esa base, con un usuario `demo` propio de los tests (`support/demo.ts`).
3. **API** (`api/dist/index.js`) en un puerto libre, con `NODE_ENV=test` y `CORS_ORIGINS` apuntando al client.
4. **Client**: `vite build` con `VITE_API_URL` apuntando a esa API, servido con `vite preview` en otro puerto libre.

Toda la configuración viaja por variables de entorno, que tienen prioridad sobre el `.env` de la raíz.

## Escribir un test

- Importá `test` y `expect` de `support/test.ts`, no de `@playwright/test`: así se toma la URL del client y queda disponible `loginAsDemo`.
- Los tests comparten la base del seed y corren de a uno. No dependas del orden: si creás datos, usá nombres únicos (`Date.now().toString(36)`).
- Preferí selectores por rol, label o placeholder (`getByRole`, `getByLabel`) a clases de Tailwind.
- Si un test se cae por un bug conocido, marcalo `test.fixme` con el número de issue en vez de borrarlo.
- Las fechas del seed son relativas a hoy. Para una pantalla que depende del día, fijá el reloj del navegador (`page.clock.setFixedTime(mondayOfThisWeek())`).
