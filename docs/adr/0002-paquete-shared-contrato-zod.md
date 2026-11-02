# ADR-0002: Paquete `@waby/shared` con el contrato de la API en Zod

- **Estado**: Aceptado
- **Fecha**: 2026-11-02
- **Autores**: Elias Palamidessi

## Contexto

La API y el client definen cada uno su propia versión de las entidades, y no coinciden:

- `client/src/exercises/exercise.type.ts` dice `muscleGroups: number[]`, pero `GET /exercises` devuelve objetos, `GET /exercises/muscleGroup/:id` devuelve strings y solo el `POST` manda números.
- Hay cuatro definiciones de `Exercise` y tres de `Training` en el client.
- En la API, los esquemas Zod tampoco coinciden con las entidades. `trainingsSchema` exige `mesocycle` y `exercisesTrainings`, que no existen, y los esquemas completos no se usan en ningún controller.

Así, un cambio en la API no rompe el typecheck del client: rompe en ejecución.

## Decisión

Crear un paquete del workspace, `shared/` (`@waby/shared`), con el **contrato** de la API escrito en Zod. La API valida con esos esquemas y el client tipa y valida con ellos.

- Por entidad, en `shared/src/<entidad>.ts`:
  - los enums del dominio (por ejemplo `MetricType`);
  - un esquema de **respuesta**;
  - un esquema de **alta**;
  - un esquema de **edición**, que es el de alta con `.partial()`.
  
  Los tipos salen de `z.infer`.
- **Requests con ids** (`trainingMethodId`, `muscleGroupIds`). **Respuestas con objetos anidados de un nivel** (`trainingMethod: { id, name }`).
- Ningún esquema de respuesta incluye el hash de la contraseña.
- Las entidades de MikroORM se quedan en `api/`. Implementan el contrato, pero no son el contrato.
- `zod` va en la misma versión que ya usa la API (3.23.8).

## Alternativas consideradas

- **Compartir las entidades de MikroORM**: llevan decoradores e importan `@mikro-orm/core`, que terminaría en el bundle de Vite.
- **Solo interfaces de TypeScript**: tipan, pero no validan. La validación de formularios del client y la de la API seguirían separadas.
- **Carpeta `_shared/` importada por ruta relativa**: le complica el `rootDir` al `tsc` de la API, que compila a `dist/`. Un paquete del workspace lo resuelve pnpm.

## Consecuencias

- Hay una sola definición por entidad. Si cambia la forma de una respuesta, `pnpm typecheck` falla en el client.
- Mandar ids en los requests corta la asignación masiva y la búsqueda de Ejercicios por nombre.
- Cambiar el contrato obliga a tocar la API y el client en el mismo cambio.
- Queda pendiente: cómo consume la API el paquete (fuente TS o build previo). Se define al armar el scaffold y se anota acá.
