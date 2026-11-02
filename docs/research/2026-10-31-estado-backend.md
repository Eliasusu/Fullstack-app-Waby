# Estado del backend de Waby (`api/`)

- **Fecha**: 2026-10-31
- **Autor**: Elias Palamidessi (con Claude)
- **Pregunta**: ¿Qué tiene hecho el backend, qué está roto y qué hace falta para presentar Waby 1.0?
- **Alcance**: rama `main` más el working tree del monorepo. El client se miró solo con grep, para saber qué endpoints consume.

## Resumen

El backend compila y tiene casi todo el CRUD escrito, pero **no está en condiciones de presentarse**. Los problemas más graves:

1. Con un token inválido o vencido, la API responde 401 y **igual ejecuta el controller**. Eso permite escribir sin autenticación y, además, tira el proceso.
2. Borrar un ejercicio en uso o un usuario con entrenamientos también puede tirar el proceso.
3. No hay control de propietario en usuarios, en la edición de ejercicios, en el alta de ítems ni en progresiones. El hash de la contraseña sale en varias respuestas.
4. `main` no tiene la sobrecarga progresiva: está en ramas sin mergear, 34 commits adelante.

La mayoría de los arreglos son chicos. Lo que falta decidir antes de empezar es qué rama es la base.

## Cómo se verificó

| Etiqueta | Significado |
|---|---|
| **Código** | Leído en el archivo y la línea citados |
| **Librería** | Comprobado en `node_modules`, en la versión instalada |
| **Script** | Ejecutado en proceso con el código compilado o con la librería real: sin base (`connect: false`, driver simulado o `127.0.0.1:1`) y sin abrir puertos. Los scripts quedaron fuera del repo |
| **Sin confirmar** | Necesita la base corriendo. Se marca en cada caso |

No se levantó la API ni MySQL en ningún momento. Los scripts prueban lo que genera el ORM (changesets y SQL) y el comportamiento del middleware, no el resultado final en una base real.

### Typecheck y build

| Comando | Resultado |
|---|---|
| `pnpm --filter @waby/api typecheck` | OK, exit 0, sin errores |
| `pnpm --filter @waby/api build` | OK, exit 0, sin errores |

Que compile dice poco: cuatro esquemas Zod están declarados como `any`. Al sacar ese `any` en una copia temporal aparecen 6 errores de `tsc` (ver la sección 5).

## 1. Relevamiento

### Por feature

| Feature | Qué hay | Estado |
|---|---|---|
| **auth** | Registro, login, logout, profile, verify. JWT en cookie, 1 hora de vida | Parcial: funciona el camino feliz, con varios errores (notas 10, 17, 22, 51, 23, 29) |
| **users** | Listar, leer, editar, borrar | Parcial: sin control de propietario, guarda la contraseña sin hash (notas 12, 13, 18) |
| **exercises** | CRUD y filtro por grupo muscular | Parcial: lecturas y borrado filtran por dueño; la edición no (notas 11, 14, 26) |
| **progresiones por reps** | CRUD montado. El client no lo usa | Parcial: sin dueño, validación ineficaz (notas 16, 27) |
| **progresiones por segundos** | CRUD escrito y **sin montar** | Roto: además, un error de tipeo impide crear (nota 27; montaje en nota 04) |
| **muscleGroups** | CRUD y búsqueda por nombre | Parcial: expone ejercicios ajenos, editable por cualquiera, búsqueda rota (notas 20, 21, 35) |
| **trainingMethods** | CRUD. `trainingMethodSchema` existe, pero no se usa | Parcial: el client solo lee (nota 20) |
| **trainings** | CRUD, por usuario y por fecha | Parcial: filtra bien por dueño, validación débil, un solo entrenamiento por día en la vista (notas 13, 26, 28) |
| **trainingItems** | Alta, edición y borrado bajo `/trainings`, duplicados en `/routines` | Parcial: el alta no valida de quién es el entrenamiento, `GET /routines/:id` está roto (notas 15, 34) |
| **sobrecarga progresiva** | No hay nada en `main`. Hay un CRUD en `origin/develop` y `origin/bugfix/sobrecarga-progresiva` | Falta en `main` (nota 50, issue #11) |
| **middlewares** | `cors`, `validateToken` | `validateToken` roto (nota 10). `cors` funciona, con orígenes fijos (nota 08) |
| **routes** | `index.routes.ts` | Montado en una ruta sin barra inicial: nunca responde (nota 04) |
| **shared** | `orm.ts`, `jwt.ts`, `config.ts`, `generateId.ts`, `getDateToday.ts` | Funcionan, con secretos en el código (nota 01). `getDateToday` se importa y no se usa (`api/trainings/trainings.controllers.ts:6`) |
| **config** | `api/config.ts` | Código muerto: grep no encuentra ningún import. Tiene una contraseña (nota 01) |

### Endpoints

Montaje en `api/index.ts:34-42`.

- **Auth** indica si la ruta pasa por `validateToken`. Todas las marcadas "sí" tienen el problema de la nota 10: un token inválido no frena la ejecución.
- **Client** es "sí" si grep encuentra en `client/src` la función de API y una llamada a ella. No comprueba que una pantalla la dispare en todos los flujos.

| Método | Ruta (`/api/v1`) | Auth | Estado | Client | Notas |
|---|---|---|---|---|---|
| POST | `/auth/register` | no | Parcial | sí | 17, 51 |
| POST | `/auth/login` | no | Parcial | sí | 22 |
| POST | `/auth/logout` | no | Completo | **no** | 29 |
| GET | `/auth/verify` | propia | Parcial | sí | 23 |
| GET | `/auth/profile` | sí | Completo | **no** | 24 |
| GET | `/users` | sí | Roto: expone a todos | **no** | 12, 13 |
| GET | `/users/:idUser` | sí | Roto: sin dueño, con hash | sí | 12, 13 |
| PUT | `/users/:idUser` | sí | Roto: sin dueño, sin hash | sí | 12, 18, 24 |
| DELETE | `/users/:idUser` | sí | Roto: sin dueño, sin await | sí | 11, 12 |
| GET | `/exercises` | sí | Completo | sí | |
| GET | `/exercises/muscleGroup/:idMuscleGroup` | sí | Completo | sí | |
| GET | `/exercises/:idExercise` | sí | Parcial: 500 si no existe | **no** | 24 |
| POST | `/exercises` | sí | Parcial: sin obligatorios | sí | 26 |
| PUT | `/exercises/:idExercise` | sí | Roto: edita ejercicios ajenos | sí | 14 |
| DELETE | `/exercises/:idExercise` | sí | Roto: sin await | sí | 11 |
| GET | `/exercises/calisthenics/progressions/reps` | sí (ver abajo) | Roto: de todos los usuarios | **no** | 16 |
| GET | `.../reps/:idProgression` | sí (ver abajo) | Roto: sin dueño | **no** | 16, 24 |
| POST | `.../reps` | sí (ver abajo) | Roto: sin dueño | **no** | 16, 26, 27 |
| PUT | `.../reps/:idProgression` | sí (ver abajo) | Roto: sin dueño | **no** | 16 |
| DELETE | `.../reps/:idProgression` | sí (ver abajo) | Roto: sin dueño, sin await | **no** | 11, 16 |
| todas | progresiones por segundos | sin montar | Roto: no responde | **no** | 04, 16, 27 |
| GET | `/trainings/user` | sí | Parcial: expone el hash propio | sí | 13 |
| GET | `/trainings/:date/user` | sí | Parcial: devuelve uno solo, con hash | sí | 13, 28 |
| POST | `/trainings` | sí | Parcial: sin obligatorios | sí | 26, 27 |
| PUT | `/trainings/:idTraining/user` | sí | Parcial: 500 si no existe | sí | 24 |
| DELETE | `/trainings/:idTraining/user` | sí | Parcial: 500 si no existe | sí | 24 |
| POST | `/trainings/:idTraining/trainingItem` | sí | Roto: entrenamiento ajeno | sí | 15, 26 |
| PUT | `/trainings/:idTraining/trainingItem/:idTrainingItem` | sí | Parcial: acepta ejercicio ajeno | sí | 15 |
| DELETE | `/trainings/:idTraining/trainingItem/:idTrainingItem` | sí | Completo: ignora `:idTraining` | sí | 15 |
| GET | `/routines/:idTrainingItem` | sí | Roto: lee el body | **no** | 34 |
| PUT | `/routines/:idTrainingItem` | sí | Parcial: igual que bajo `/trainings` | **no** | 15, 34 |
| DELETE | `/routines/:idTrainingItem` | sí | Completo | **no** | 34 |
| GET | `/muscleGroups` | sí | Parcial: ejercicios ajenos | sí | 21 |
| GET | `/muscleGroups/:idMuscleGroup` | sí | Parcial: ejercicios ajenos | sí | 21, 24 |
| GET | `/muscleGroups/name/:name` | sí | Roto: parámetro equivocado | **no** | 35 |
| POST | `/muscleGroups` | sí | Parcial: cualquier usuario | **no** | 20 |
| PUT | `/muscleGroups/:idMuscleGroup` | sí | Parcial: sin validar | **no** | 20 |
| DELETE | `/muscleGroups/:idMuscleGroup` | sí | Parcial: cualquier usuario | **no** | 20 |
| GET | `/trainingMethods` | sí | Completo | sí | |
| GET | `/trainingMethods/:nameMethod` | sí | Parcial: 500 si no existe | sí | 24 |
| POST | `/trainingMethods` | sí | Parcial: sin validar | **no** | 20 |
| PUT | `/trainingMethods/:idMethod` | sí | Parcial: sin validar | **no** | 20 |
| DELETE | `/trainingMethods/:idMethod` | sí | Parcial: cualquier usuario | **no** | 20 |
| GET | `api/index/v1` (sin barra, fuera de `/api/v1`) | - | Roto: nunca matchea | **no** | 04 |

**Progresiones por reps: sí tienen token, pero por accidente.** Están montadas sin `validateToken` (`api/index.ts:38`), pero el prefijo `/api/v1/exercises` de la línea anterior ya lo ejecuta (`:37`), y su router no matchea la ruta y deja pasar el pedido. Reproducido con Express real y el mismo orden de montaje: sin cookie responde 401 y no llega al handler. Con un token inválido responde 401 y llega igual (nota 10). Depende del orden de las líneas: invertirlas deja las rutas abiertas.

## 2. Errores

Cada fila tiene su nota en `.vault/issues/`, con la evidencia completa.

### P0: seguridad grave o bloqueo

| Nota | Error | Evidencia | Verificación |
|---|---|---|---|
| 10 | Token inválido o vencido: responde 401, ejecuta el controller y el proceso termina | `api/middlewares/validateToken.ts:9-13`, `:18` | Script, sobre el middleware real y un controller con el mismo patrón. Falta confirmar con los controllers reales y la base |
| 11 | `removeAndFlush` sin `await`: un error de clave foránea termina el proceso | `api/users/users.controllers.ts:63`, `api/exercises/exercises.controllers.ts:96`, `progressionsReps.controllers.ts:85`, `progressionsPerSec.controllers.ts:85` | Código y script del rechazo. Falta confirmar el error real de MySQL |
| 12 | Cualquier sesión lista, lee, edita y borra usuarios | `api/users/users.controllers.ts:13`, `:25`, `:36-44`, `:61-63` | Código |
| 13 | El hash de la contraseña sale en las respuestas | `api/users/user.entity.ts:15-16`, `api/trainings/trainings.controllers.ts:12`, `:22` | Script, con driver simulado |
| 14 | Se edita un ejercicio ajeno: `null !== undefined` | `api/exercises/exercises.controllers.ts:69-76` | Script: changeset `update`. Falta confirmar el `UPDATE` real |
| 15 | Alta de ítems en entrenamientos ajenos | `api/trainingItems/trainingItems.controllers.ts:42`, `:75` | Código |
| 16 | Progresiones sin dueño | `progressionsReps.controllers.ts:11`, `:21`, `:30`, `:59`, `:82` | Código |
| 17 | El registro guarda `req.body` crudo: id elegido, robo de ejercicios | `api/auth/auth.controllers.ts:30` | Script: changesets `update:Exercise` y `create:Training` |
| 18 | `PUT /users/:id` guarda la contraseña en texto plano | `api/users/users.controllers.ts:43` | Script: changeset |

Los secretos en el código ya están en la nota 01.

### P1: rompe funcionalidad

| Nota | Error | Evidencia | Verificación |
|---|---|---|---|
| 51 | Desde el segundo registro por UI: `phone: ''` duplicado | `client/src/pages/Welcome/RegisterPage.tsx:37`, `api/users/user.entity.ts:27` | Código y DDL. **Sin confirmar en ejecución** |
| 20 | Catálogos editables por cualquier usuario, sin validar | `api/muscleGroups/muscleGroups.controller.ts:48`, `api/trainingMethods/trainingMethod.controller.ts:33`, `:46` | Código y script |
| 21 | `/muscleGroups` expone ejercicios de todos | `api/muscleGroups/muscleGroups.controller.ts:11`, `:22`, `:72` | Script |
| 22 | Login: acepta operadores (`$ne`), enumera usuarios, 500 sin contraseña | `api/auth/auth.controllers.ts:48-52` | Script para el operador. Código para el resto |
| 23 | `/auth/verify`: `findOne` sin `await`, un usuario borrado sigue válido | `api/auth/auth.controllers.ts:90-91` | Código |
| 24 | Inexistente responde 500 o éxito, casi nunca 404. Ids `NaN` llegan al SQL | Ver nota: `findOneOrFail` en más de 10 lugares, `api/users/users.controllers.ts:38` | Código. Script para `NaN` |
| 25 | Sin manejador de errores: stack traces, `err.message` al cliente | `api/index.ts:24-42`, `api/middlewares/cors.ts:13` | Código y Express 4.19.2 |
| 26 | Altas con esquema parcial: `{}` valida. `mesocycle` obligatorio y sin entidad | `api/exercises/exercises.controllers.ts:50`, `api/trainings/trainings.controllers.ts:39-48`, `api/trainings/trainings.schema.ts:5`, `:30` | Script |
| 27 | Reglas de Zod que no se aplican, y `orderProgresion` mal escrito | `progressionReps.schema.ts:5-16`, `progressionSec.schema.ts:8` | Script y Zod 3.23.8 |
| 28 | La vista del día devuelve un solo entrenamiento | `api/trainings/trainings.controllers.ts:22` | Código |
| 29 | Cookie con `httpOnly: false`, logout sin pasar por el servidor | `api/auth/auth.controllers.ts:33`, `:54`, `client/src/users/auth.context.tsx:90` | Código |
| 50 | `main` sin sobrecarga progresiva, 34 commits atrás de `develop` | `git log`, `git diff` sobre ramas remotas | Comando |

### P2

| Nota | Error | Evidencia |
|---|---|---|
| 34 | `GET /routines/:id` lee el body | `api/trainingItems/trainingItems.controllers.ts:12` |
| 35 | `/muscleGroups/name/:name` lee otro parámetro | `api/muscleGroups/muscleGroups.routes.ts:23`, `muscleGroups.controller.ts:71` |
| 36 | Logs con bodies | `api/trainings/trainings.controllers.ts:67`, `progressionsReps.controllers.ts:35-37` |
| 37 | `Cascade.ALL` puede borrar catálogos (latente) | `api/exercises/exercise.entity.ts:24-27`, `api/users/user.entity.ts:36-39` |

### Revisado y sin problema

Para no reabrir estos temas:

- **`const em = orm.em` con `RequestContext`: está bien.** Es la pregunta obvia al leer el código, pero el `em` global delega en el del contexto (`EntityManager.getContext`, `@mikro-orm/core` 5.8.10), y `RequestContext.create` está montado en `api/index.ts:30-32`. `allowGlobalContext` es `false` por defecto, así que un uso fuera de contexto lanzaría error en lugar de compartir estado.
- **`em.create` seguido de `em.flush` sin `persist`: está bien.** En 5.8.10 `persistOnCreate` es `true` por defecto (`Configuration.js:272`). Script: genera el `create` en el changeset. Es un valor por defecto de la configuración: si alguna vez se toca la versión, hay que revisarlo.
- **N+1: no encontré.** Los `populate` usan `SELECT_IN` por defecto (`Configuration.js:266`), que resuelve cada relación con una consulta adicional, no con una por fila. No hay bucles con consultas en los controllers. El problema es de tamaño, no de cantidad: nota 21.
- **`Exercise.dateCreated` no pierde la hora.** `type: 'date'` genera `datetime` (DDL generado por MikroORM: `` `date_created` datetime not null default current_timestamp() ``; el dump también tiene `datetime` en la línea 88). Hay que corregir la nota 06.
- **Dos usuarios pueden tener la misma contraseña.** `bcrypt.hashSync` usa una sal aleatoria (script: dos hashes de la misma clave son distintos), así que `unique` en `password` no choca. Es una restricción inútil, no un bug visible. También corrige a la nota 06.
- **Consultas de exercises y trainings:** las lecturas y los borrados filtran por dueño correctamente. Las excepciones son las de las notas 14 y 15.
- **JWT:** `jsonwebtoken` 9 rechaza tokens sin firma salvo que se pida `none` explícitamente (`verify.js:117`), y la app no lo pide.
- **`express.static('client')` hoy es inofensivo.** `pnpm --filter` corre en `api/`, y `api/client` no existe. La nota 04 dice que sirve el código fuente del front: no lo hace mientras el directorio de trabajo sea `api/`.

## 3. Mejoras

### Entra en 1.0

| Mejora | Nota | Motivo |
|---|---|---|
| Unificar los errores | 39 | Destraba el issue #12 |
| Manejador global de errores | 25 | Evita caídas y filtraciones |
| Seed de catálogos | 38 | Una base nueva hoy no puede registrar usuarios (sin confirmar) |
| Logs sin datos sensibles | 36 | Barato y necesario antes de cualquier deploy |
| Script `start` en `api/package.json` | Ampliar 03 | Hoy solo hay `dev:server` y `dev:test` |

### Después de 1.0

Sin nota, a propósito: no traben la entrega.

- **Límite de intentos en login** y cabeceras de seguridad. Suman dependencias; importan cuando haya deploy público.
- **Paginación** en `GET /exercises` y `GET /trainings/user`. Con los volúmenes de una demo no se nota.
- **`bcrypt.hash` y `compare` asíncronos** en lugar de `hashSync` y `compareSync` (`api/auth/auth.controllers.ts:29`, `:51`): bloquean el event loop. No se nota con pocos usuarios.
- **Migraciones de MikroORM** en lugar de `updateSchema`: la decisión ya está en la nota 05.
- **Logger estructurado y métricas:** parte de la vidriera de observabilidad.
- **Unificar las respuestas de éxito:** obliga a tocar todo el client.
- **Borrar código muerto:** `validateTraining`, `validateRoutine`, `validateExercises`, `getDateToday`, `getAll` de ítems.

## 4. Tests

**No hay ninguno.** `git ls-files` no encuentra archivos de test y `api/package.json` no tiene runner ni script `test`. En `client/package.json` solo aparece `@types/jest`.

### Qué necesita el código para ser testeable (nota 31)

1. Separar la app del arranque: importar `api/index.ts` conecta, sincroniza y abre el puerto (`:45-48`).
2. Config de la base por variables de entorno (nota 01): `api/shared/db/orm.ts:5` inicializa con valores fijos al importarse.
3. MySQL 8 de prueba (nota 09), con limpieza por `refreshDatabase()` o `clearDatabase()`, disponibles en 5.8.10.

### Con qué herramienta

**Recomiendo `node:test` sobre el `dist` compilado, con `fetch` contra `listen(0)`:** no suma dependencias. La alternativa obvia, Vitest, usa esbuild, y [esbuild no soporta `emitDecoratorMetadata`](https://esbuild.github.io/content-types/), del que dependen las entidades por usar `ReflectMetadataProvider` (`Configuration.js:315`). Necesitaría un plugin de SWC. No probé esa combinación. SQLite no sirve como atajo: las restricciones y los tipos serían otros. La decisión es tuya, y conviene alinearla con la auditoría de `client/`.

### Qué tests, en orden

| Prioridad | Tests | Tipo | Necesita base | Nota |
|---|---|---|---|---|
| 1 | `validateToken`: sin cookie, basura, firma mala, vencido, válido | Unitario | No | 32 |
| 2 | Matriz de propiedad con usuarios A y B, sobre cada recurso | Integración | Sí | 32 |
| 3 | Ninguna respuesta contiene `password` | Integración | Sí | 32 |
| 4 | Registro: campos extra, dos altas seguidas | Integración | Sí | 32 |
| 5 | Borrado rechazado por clave foránea: la API sigue viva | Integración | Sí | 32 |
| 6 | Esquemas Zod: casos válidos e inválidos | Unitario | No | 33 |
| 7 | 400 y 404 por recurso, formato de error | Integración | Sí | 33 |
| 8 | Flujo completo: ejercicio, entrenamiento, ítem, completado | Integración | Sí | 33 |
| 9 | Sobrecarga progresiva, cuando esté en la base elegida | Integración | Sí | 33 |

## 5. Refactors

Solo los que tienen un costo concreto si no se hacen.

| Refactor | Motivo | Si no se hace | Nota |
|---|---|---|---|
| Separar `app` de `index` | Importar la app abre un puerto y toca la base | No se pueden escribir tests de integración | 31 |
| Identidad en `req.user`, fuera de `req.body` | Permitió que `res` pasara como usuario. Un `id` `undefined` se convierte en `user_id_user is null` y lee filas sin dueño en lugar de fallar | Cada controller nuevo repite el riesgo | 40 |
| Sacar `any` de cuatro esquemas Zod | Medido: al sacarlo aparecen 6 errores de `tsc`, incluido el `RangeError` de `POST /trainings` | Typecheck sigue en verde sobre bugs reales | 41 |

**Lo que no propongo refactorizar para 1.0:**

- **Capa de servicios o repositorios.** Es de gusto, para este tamaño.

## 6. Conclusiones y preguntas abiertas

### Conclusiones

- **Waby no se puede presentar en este estado, pero está cerca.** El CRUD existe. Los P0 son, en su mayoría, arreglos de pocas líneas por archivo. Lo que más trabajo lleva es la matriz de propiedad y los tests.
- **El primer paso es decidir la base (nota 50), no codear.** Arreglar sobre `main` y mergear después va a generar conflictos en los mismos archivos.
- **Orden sugerido:**
  1. Nota 50, decidir la rama base.
  2. Notas 01 y 09, para poder levantar el proyecto.
  3. Nota 10: es la que más riesgo saca, y es chica.
  4. Notas 11 a 18, con los tests de la 31 y la 32 a medida que avanzás.
  5. Nota 51, enseguida de levantar la base, para confirmarla.
- **La carga es real.** La mayoría de las notas P0 y P1 son de zona Elias, y vos además querés practicar y hacer la parte de infra. Si el tiempo no alcanza, lo que puede esperar son las notas P2 y parte de la 27. Las notas 10 a 18 no: un docente con DevTools encuentra varias en minutos. También conviene repartir con Franco antes de arrancar: la parte de `client/` de las notas 51, 29 y 39 es suya según el reparto propuesto, que todavía no conoce.

### Sin confirmar en ejecución

Todo esto necesita MySQL levantado. Conviene probarlo apenas exista la nota 09:

1. Los escenarios de la nota 10 con los controllers reales: escritura con cookie basura y caída del proceso.
2. El error real de clave foránea y la caída de la nota 11.
3. El segundo registro por UI de la nota 51.
4. Los `UPDATE` reales de las notas 14, 17 y 18: los scripts llegaron hasta el changeset.
5. Qué responde MySQL ante `id = NaN` (nota 24) y el texto exacto de los errores que llegan al cliente (nota 25).
6. Que una base nueva sin catálogos no pueda registrar usuarios (nota 38).
7. Qué imprime `debug: true` (nota 36) y el comportamiento de `clearCookie` entre dominios (nota 29).

### Preguntas abiertas

Son decisiones de Elias. El detalle está en cada nota.

- ¿Qué rama es la base de 1.0, y Franco está de acuerdo? (nota 50)
- ¿Qué pasa al borrar un ejercicio en uso o una cuenta con datos? (nota 11)
- ¿Los catálogos se administran por API o quedan fijos por seed? (notas 20 y 38)
- ¿Un usuario puede tener más de un entrenamiento por día? (nota 28)
- ¿403 o 404 para recursos ajenos? (nota 12)
- ¿Las progresiones entran en la UI de 1.0? Hoy no tienen pantalla. (nota 16)
- ¿`weight` sigue siendo texto en 1.0? (notas 06 y 27)
- ¿Qué runner de tests usamos? (nota 31)
- ¿Los usuarios del dump son inventados? Sus hashes están públicos. (nota 38)
