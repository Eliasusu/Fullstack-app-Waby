# Estado del frontend de Waby

- **Fecha**: 2026-10-31
- **Autor**: Elias Palamidessi (con Claude)
- **Pregunta**: ¿Qué tan lejos está `client/` de poder presentarse como Waby 1.0, qué está roto y qué hay que hacer antes de fin de año?
- **Alcance**: `client/` en `main` más el working tree actual. `api/` se leyó solo para verificar el contrato. Las ramas remotas se leyeron con `git show` y `git diff`, sin hacer checkout.

**Cómo leer la evidencia**

| Marca | Significa |
|---|---|
| **[C]** | Verificado corriendo un comando. |
| **[V]** | Verificado leyendo y trazando el código o la librería instalada. **Sin confirmar en ejecución**: la app no se abrió. |
| **[S]** | Sospechado. Depende del navegador, de tiempos de red o de datos reales. |

Las rutas de código son relativas a `client/src/` salvo que digan `api/`, `dump/` o `node_modules`.

## Resumen

1. **`main` no tiene la sobrecarga progresiva.** Está en `origin/bugfix/sobrecarga-progresiva`, 35 commits adelante, junto con la pantalla de errores. Sin integrarla, el último paso de la demo no existe. **[C]**
2. **El flujo principal se recorre pero se rompe en muchos puntos**: el registro falla desde el segundo usuario, recargar la página te saca de donde estabas, el Home re-renderiza sin parar, y el checkbox de completado del Home pega contra `/trainings/-1/user`. **[V]**
3. **El front miente sobre lo que pasó.** Hay toasts de éxito que salen antes de la respuesta o sin importar el resultado, y salvo el de `AuthContext`, el `errors` de los contextos no lo consume nadie. **[V]**
4. **Tests: cero.** Typecheck, lint y build fallan. **[C]**

## 1. Relevamiento

### 1.1 Chequeos

| Comando | Resultado **[C]** |
|---|---|
| `pnpm --filter @waby/client typecheck` | **Falla (exit 2).** 3 errores: `exercise-table2/page.tsx:30` (`nameMuscleGroup` sobre `number`), `progressionRep.type.ts:1` y `progressionSec.type.ts:1` (módulo `@/types/exercise.type.ts` inexistente). |
| `pnpm --filter @waby/client lint` | **Falla (exit 1).** 2 errores (`muscle-group.context.tsx:30`, `training-method.context.tsx:28`, directivas sin uso) y 2 warnings (`ui/button.tsx:56`, `ui/form.tsx:170`). |
| `pnpm --filter @waby/client build` | **Falla (exit 2)** en `tsc`, con los mismos 3 errores. |
| `pnpm exec vite build --outDir <scratchpad>` (extra, sin `tsc`) | **Pasa.** El bundle se genera: JS de 653,93 kB (el aviso de 500 kB aparece) y CSS de 37 kB. O sea que lo único que frena el build es `tsc`. |
| Tests (`git ls-files` + `find`) | No hay archivos de test, ni config de Vitest, Jest o Playwright, ni `.github/`. |

Los tres resultados coinciden con la nota 02. No quedaron cambios en el working tree después de correrlos.

### 1.2 Rutas y pantallas

Definidas en `App.tsx:32-40`. No hay ruta `*` ni error boundary (`grep` vacío).

| Ruta | Pantalla | Estado | Endpoints | Qué le falta o qué rompe |
|---|---|---|---|---|
| `/` | `Welcome` | **Completa** | ninguno | El texto habla de "routines" (`Welcome.tsx:10`). `Slogan` está definido dentro del componente (`Welcome.tsx:21`). |
| `/login` | `LoginPage` | **Parcial** | `POST auth/login`, `GET auth/verify` (en `AuthProvider`) | Remember me, Forgot y Google no hacen nada. Un 500 tira la app abajo (§2.3). |
| `/register` | `RegisterPage` | **Rota** | `POST auth/register` | Falla desde el segundo usuario (§2.1). El select de Método de entrenamiento no tiene efecto (§2.4). |
| `/home` | `Header`, `Activity`, `DayRoutine`, `CalendarHome`, `NavBar` | **Rota en partes** | `GET trainings/user`, `GET trainings/:date/user`, `PUT trainings/:id/user` | Loop de render, checkbox roto, grilla con fechas equivocadas. `CalendarHome` es decorativo (`Home/components/Calendar.tsx:5-17`). |
| `/calendar` | `CronogramPage` → `TrainingDay` | **Parcial** | `GET trainings/:date/user`, `GET trainings/user`, `POST trainings`, `PUT/DELETE trainings/:id/user`, `POST/PUT/DELETE trainings/:id/trainingItem[/:id]`, `GET exercises` | Es el corazón del producto y tiene varios bugs (§2.5). |
| `/create` | `MuscleGroups`, `ExercisesTable2` | **Parcial** | `GET muscleGroups`, `GET trainingMethods`, `GET exercises`, `GET exercises/muscleGroup/:id`, `POST exercises`, `PUT/DELETE exercises/:id` | Crear anda en el camino feliz; editar falla o pierde datos (§2.6). No hay UI de Progresiones. |
| `/profile` | `ProfileForm` | **Rota en partes** | `GET/PUT/DELETE users/:id` | Vacía después de registrarse. Eliminar tiene una carrera. No tiene `Header` ni `NavBar` (`pages/User/main.tsx:13-17`). |
| `*` | no existe | **Falta** | | Cubierto por issue #13. |
| `/goals` | solo en la rama | **No está en `main`** | `/progressiveOverload` | Sobrecarga progresiva (§1.4). |

Componentes que no se usan en ninguna ruta **[C]**: `pages/Cronogram/components/TrainingCalendar.tsx` (un CRUD local que nunca llama a la API), `trainings/components/training-table/*`, `components/DropdownProfile.tsx`.

### 1.3 Contrato con la API

Con `baseURL` terminada en `/`, los paths con barra inicial no duplican la barra: `combineURLs` la normaliza (`node_modules/axios/lib/helpers/combineURLs.js`, axios 1.7.4). **[V]**

| Llamada del client | API | Ruta | Payload y respuesta |
|---|---|---|---|
| `POST auth/register` (`users/auth.api.ts:4`) | `api/auth/auth.routes.ts:8` | OK | **Roto.** Responde `[username]` (`api/auth/auth.controllers.ts:35`); el client lo guarda como `{id, username}` (`users/auth.context.tsx:66`). El `phone: ''` choca con el índice único (§2.1). |
| `POST auth/login` (`:6`) | `api/auth/auth.routes.ts:11` | OK | OK en éxito. Los errores tienen tres formas distintas (§2.3). |
| `GET auth/verify` (`:8`) | `api/auth/auth.routes.ts:17` | OK | OK. |
| `PUT users/:id` (`:10`) | `api/users/users.routes.ts:13` | OK | **Roto.** Responde `{message}` (`api/users/users.controllers.ts:45`) y pisa `user` (`auth.context.tsx:109`). |
| `DELETE users/:id` (`:12`) | `api/users/users.routes.ts:16` | OK | **Roto.** Responde el usuario y el client lo re-autentica (`auth.context.tsx:121-122`). |
| `GET users/:id` (`:14`) | `api/users/users.routes.ts:10` | OK | OK (`res.data.data`). |
| `GET /exercises` (`exercises/exercise.api.ts:6`) | `api/exercises/exercises.routes.ts:7` | OK | **El tipo miente.** `muscleGroups` llega como objetos; el tipo dice `number[]` (`exercises/exercise.type.ts:11`). |
| `GET /exercises/muscleGroup/:id` (`:8`) | `:8` | OK | `muscleGroups` llega como `string[]` y sin `trainingMethod` (`api/exercises/exercises.controllers.ts:14-23`). |
| `POST /exercises` (`:4`) | `:14` | OK | Pide `number[]` (`api/exercises/exercises.schema.ts:11`). Todo es opcional del lado de la API (`validateParcialExercises`). |
| `PUT /exercises/:id` (`:12`) | `:17` | OK | Depende de qué listado se editó (§2.6). |
| `DELETE /exercises/:id` (`:10`) | `:20` | OK | `removeAndFlush` sin `await` (`api/exercises/exercises.controllers.ts:96`): el GET que sigue puede ver el ejercicio todavía. **[S]** |
| `GET /muscleGroups` (`muscleGroups/muscle-group.api.ts:3`) | `api/muscleGroups/muscleGroups.routes.ts:8` | OK | OK. Trae `exercises` populados de todos los usuarios (`muscleGroups.controller.ts:11`): lo debería tomar la auditoría de `api/`. |
| `GET /muscleGroups/:id` (`:5`) | `:11` | OK | Nadie consume `getMG`. |
| `GET /trainingMethods` (`trainingMethods/training-method.api.ts:5`) | `api/trainingMethods/trainingMethod.routes.ts:7` | OK | OK. |
| `GET /trainingMethods/:id` (`:3`) | `:10` | OK a medias | La API busca por `nameMethod`; el client llama `id` al parámetro. Nadie consume `getTraining`. |
| `GET /trainings/:date/user` (`trainings/training.api.ts:4`) | `api/trainings/trainings.routes.ts:12` | OK | Devuelve `null` si no hay Entrenamiento y solo uno por día (`findOne`), aunque se puedan crear varios. |
| `GET /trainings/user` (`:6`) | `:9` | OK | **Roto en 4 lugares.** Responde un array (`api/trainings/trainings.controllers.ts:13`); el client lee `.data.trainings` (`trainings/training.context.tsx:110,152,178,209`). `getTrainings` sí lee bien (`:137`). |
| `POST /trainings` (`:8`) | `:15` | OK | OK. Zod descarta `frecuency` y `trainingItems`. |
| `PUT /trainings/:id/user` (`:10`) | `:20` | OK | OK con un id real; `-1` da 500 (§2.5). |
| `DELETE /trainings/:id/user` (`:12`) | `:25` | OK | OK. |
| `POST /trainings/:id/trainingItem` (`trainingItem/trainingItem.api.ts:9`) | `:17` | OK | `sets`/`reps` en 0 (default del form) da 400 (`.positive()`, `api/trainingItems/trainingItems.schema.ts:10-15`). |
| `PUT /trainings/:id/trainingItem/:idItem` (`:11`) | `:22` | OK | OK, pero el client manda el ítem equivocado (§2.5). |
| `DELETE /trainings/:id/trainingItem/:idItem` (`:13`) | `:27` | OK | OK. |
| `GET /trainings/:id/trainingItem/:id` (`:7`) | **no existe** | **Rota** | Código muerto, además repite el mismo id dos veces. |

Lo que la API expone y el client no llama: `/routines`, `/exercises/calisthenics/progressions/reps`, `auth/logout`, `auth/profile`. Los tipos de Progresión existen (`exercises/progressions/*`) pero no hay pantalla ni llamada. **[C]**

Sin secretos en `client/src` (`grep`). **[C]**

### 1.4 Ramas: `main` no es la versión más avanzada

| Rama | Adelante de `main` | Último commit | Contenido en `client/` y `api/` |
|---|---|---|---|
| `origin/bugfix/sobrecarga-progresiva` | 35 | 2025-08-16 | Todo lo de abajo más ajustes al flujo de la sobrecarga. |
| `origin/develop`, `origin/feature/11-nuevo-requerimiento` | 34 | 2025-02-27 | `/goals`, CRUD de Sobrecarga progresiva (front y API), `ErrorPage`, ruta `*`, `useErrorHandler`, cambios en registro y auth. |
| `origin/ship`, `origin/feature/usuario` | 0 | | Atrasadas, sin nada propio. |

Todo esto salió de `git rev-list` y `git diff --stat`. **[C]** La rama no se auditó a fondo. Leyendo sus archivos clave encontré:

**Sigue igual que en `main`** (`git show`, **[C]**): `ProtectedRoute`, el efecto sin dependencias de `Activity` (`:23-25`), la sincronización de `DayRoutine` (`:48-56`), `.data.trainings` (`training.context.tsx:110,152,178,209`), `trainingItems[0]` (`TraningDay.tsx:226`), `hangleChange`, la URL hardcodeada y los errores de typecheck de `progressionRep.type.ts` y `exercise-table2/page.tsx`. El resto de los bugs de §2 no se comprobó en la rama.

**Rompe cosas que `main` tiene andando** **[V]**:

- Registro: el form ya no tiene `onSubmit`, y el botón `type="submit"` tiene `onClick` sin `preventDefault` dentro de un `<form action="/register" method="POST">`. Es un POST nativo además del de axios. Además manda `calisthenics`/`gym`, que la API busca por `nameMethod`, cuando el dump tiene `Calistenia`/`Gimnasio` (`dump/*.sql:328`).
- Login: el `catch` lee `response.data.message.issues`, pero la API responde credenciales incorrectas con un array, así que el propio `catch` tira `TypeError`.

**Tiene bugs propios** **[V]**:

- `getProgressiveOverloadsByExercise` llama a `/progressiveOverload/exercise/:id`, pero la API monta `/progressiveOverload/progressiveOverload/:idExercise`.
- `handleSubmitUpdatePO` hace `update(localPOs[0])`: siempre el primero, el mismo patrón que `TraningDay`.
- `handleChangeUpdatePO` modifica `newPO`, no lo que se está editando.
- Después de `await create(...)` lee `errors` de la clausura, no el valor nuevo.

**No se puede presentar así**: `ErrorPage` dice "volvete a tu cueva", "exploto todo" y "vola loquitaaa", y `api/index.ts` tiene un `console.log('PORQUE CHOTA NO ANDA...')`.

Integrar no es un merge directo: la rama modifica `api/pnpm-lock.yaml` y `client/pnpm-lock.yaml`, que el monorepo (ADR-0001) borró, y agrega `date-fns` a la API. **[C]**

## 2. Errores

Todo se refiere a `main`, y entre paréntesis va la nota del vault.

### 2.1 Bloqueante

- **Registro: desde el segundo usuario falla sin mensaje (nota 51). [V]** `pages/Welcome/RegisterPage.tsx:37` manda `phone: ''` fijo. La API lo guarda con `em.create(User, req.body)` (`api/auth/auth.controllers.ts:30`). `User.phone` es `unique` (`api/users/user.entity.ts:27`, `dump/*.sql`, `UNIQUE KEY user_phone_unique`). En MySQL `''` es un valor, no `NULL`: el segundo `''` viola el índice, da 500, y el client no muestra `{error}` (§2.3).
- **`main` sin la sobrecarga progresiva (nota 50). [C]** Ver §1.4.

### 2.2 Sesión y rutas protegidas

- **Recargar saca al usuario de donde estaba (nota 52). [V]** `isAuthenticated` arranca en `false` (`users/auth.context.tsx:60`), `checkUser` es asíncrono (`:148-165`) y `ProtectedRoute` no distingue "todavía no sé" de "no estás logueado" (`lib/ProtectedRoute.tsx:7`). F5 en `/calendar` va a `/login`, y al resolver `verify`, `LoginPage.tsx:22-24` manda a `/home`. Esa navegación no usa `replace`, así que el botón Atrás vuelve a `/login`, que empuja de nuevo a `/home`.
- **Sesión vencida: la app queda zombi (nota 53). [V]** El JWT dura 1 hora (`api/shared/jwt.ts:6`) y la cookie no tiene `maxAge` (`api/auth/auth.controllers.ts:54`). No hay interceptor de axios (`grep` vacío; `lib/axios.ts:3-6`). Tras una hora, todo da 401, nadie lo muestra y la pantalla sigue como si nada.
- **`Header` se puede caer (nota 54).** `getUserFromToken` (`components/Header.tsx:12-19`) decodifica el JWT con `atob`, y `:52` lee `user.username` sin chequear `null`. Sin cookie con la app autenticada: `TypeError` y pantalla en blanco, sin boundary. **[V]** Un JWT usa base64url: `atob` rompe con `-` o `_`. Probado en Node 80 combinaciones: 6 tiran `InvalidCharacterError` (por ejemplo `aa~bc`), y los nombres con tildes se muestran mal (`martín` → `martÃ­n`). **[C]**
- **`user` se pisa con cualquier respuesta (nota 55). [V]** Tras registrarse `user` es `['nombre']`; tras guardar el perfil es `{message}`. En los dos casos `user.id` queda `undefined`, así que `pages/User/main.tsx:10` llama `getOneProfile('')`, que retorna sin hacer nada (`auth.context.tsx:133`). Recién registrado, `/profile` queda vacía y el submit no hace nada (`ProfileForm.tsx:19`). Después de guardar, los datos dejan de refrescarse.
- **Eliminar perfil es una carrera (nota 56).** `ProfileForm.tsx:134-135` llama `deleteProfile` sin `await` y enseguida `logout()`. **[V]** Si el DELETE responde bien, `auth.context.tsx:121-122` vuelve a poner `isAuthenticated=true`, sin cookie: `LoginPage` manda a `/home` y `Header` se cae. **[V]** Si `logout` borra la cookie antes de que el navegador la adjunte, el DELETE da 401 y el perfil sigue vivo, con el toast "Profile deleted". **[S]** Con `id` vacío (§ anterior), va a `users/`, y también sale el toast. **[V]**
- **Datos de otro usuario tras logout (nota 58). [V]** Los providers viven arriba del router (`App.tsx:23-49`) y `logout` solo limpia `user` e `isAuthenticated` (`auth.context.tsx:89-93`). `allDataUser`, `trainings`, `training` y los ejercicios sobreviven. Peor: `ProfileForm.tsx:15` inicializa `values` con el `allDataUser` viejo y `:22-27` prioriza esos valores, así que si B guarda sin tocar nada, se mandan los datos de A contra el id de B. El índice único de `username` y `email` debería frenarlo con un 500, y aun así sale el toast de éxito.

### 2.3 Errores de autenticación

Nota 57. **[V]**

- Login con 500: `setErrors(error.response.data.message)` (`auth.context.tsx:84`) recibe `undefined` porque la API manda `{error}` (`api/auth/auth.controllers.ts:58`). El efecto de `:96` hace `errors.length` y tira `TypeError`. Sin boundary, pantalla en blanco.
- API caída: `error.response` es `undefined` y el `catch` tira (`:70`, `:81`). Promesa rechazada sin mensaje.
- Usuario o email repetido: la API manda `{error: [...]}` (`api/auth/auth.controllers.ts:24,27`); `RegisterPage.tsx:54` solo pinta arrays. No se ve nada.
- `updateProfile`, `deleteProfile` y `getOneProfile` guardan `[{message}]`, pero las páginas renderizan cada error como string (`LoginPage.tsx:46-47`). Con un error de esos y logout en menos de 3 segundos, React intenta renderizar un objeto y explota.

### 2.4 Formularios

- **`onChange` pisado en registro (nota 59). [V]** `RegisterPage.tsx:64,71,78,92,99,106` ponen `onChange={hangleChange}` después de `{...register()}` y anulan el de react-hook-form. RHF 7.52.2 solo se entera por `onBlur`, que es el mismo handler (`node_modules/react-hook-form/dist/index.esm.mjs:1914-1938,2152-2153`), y la validación usa `_formValues` (`:795-797`). Clic en el botón: anda porque hay blur. Enter dentro de un campo: ese valor no llegó y da "is required" aunque esté escrito. **[S]** para Enter según navegador y autofill.
- **Select de Método de entrenamiento sin efecto (nota 59). [V]** `register` está sobre cada `<option>` (`RegisterPage.tsx:113-116`) y el `<select>` no tiene `onChange`. Elegir Gym no cambia nada. Los ids están hardcodeados (coinciden con `dump/*.sql:328`; en una base sin dump, el registro rompería).
- **Sin validación real (nota 73). [V]** Ejercicio, Entrenamiento, Ítem y Perfil se mandan sin chequear nada (`MuscleGroups.tsx:172-178`, `TraningDay.tsx:643-649,481-483`, `ProfileForm.tsx:14`). Registro solo pide `required`, cuando la API exige usuario ≥ 6, contraseña 8-16, nombre ≤ 20, peso 20-150 entero (`api/users/users.schema.ts`). `parseInt('')` da `NaN` en `TraningDay.tsx:397,405,525,534`, y `NaN` se serializa como `null`. En perfil no se puede vaciar un campo (`ProfileForm.tsx:22-27`, `||`). `UserSchema` existe pero no se usa (`users/user.schema.ts`).
- **Toasts de éxito sin resultado (nota 69). [V]** `ProfileForm.tsx:30-36,134-140` y `TraningDay.tsx:253-260,235-240,266-271,614-622,692-699` avisan éxito sin esperar. Los dos últimos se disparan en el `onClick` del botón, antes del submit. Las acciones de los contextos devuelven `void` y tragan el error. El `errors` de Ejercicio, Entrenamiento, Grupo muscular y Método no lo lee ninguna pantalla (`grep`). **[C]** `getAllExercises` y `getExercises` no tienen `try/catch` (`exercises/exercise.context.tsx:83-98`), y el `try` de `MuscleGroups.tsx:54-103` no captura nada porque no hace `await`.

### 2.5 Home y Entrenamientos

- **Loop de render en `Activity` (nota 60). [V]** `components/Activity.tsx:23-25` es un efecto sin array de dependencias que hace `setActivityData` con un array nuevo (`:63`) en cada corrida: re-render, efecto, set, para siempre, mientras el Home esté montado. React lo cuenta como anidado y avisa en desarrollo (`NESTED_PASSIVE_UPDATE_LIMIT`, `node_modules/react-dom/cjs/react-dom.development.js:25363,27296`). En "Anual" arma 365 objetos por vuelta. Impacto en CPU **[S]**.
- **Grilla de `Activity` con fechas equivocadas (nota 61). [C]**, calculado en Node con la lógica de `:32-46`:
  - Mensual, octubre 2026: va del 28/09 al 28/10. **Hoy (31/10) no aparece**, y los días de septiembre cuentan en el total.
  - Las etiquetas arrancan en `Mar` (`:92`), pero el primer cuadro es lunes.
  - Semanal: arranca 5 días atrás, no en lunes, con etiquetas `Lun`..`Dom` fijas. Hoy cae lunes solo por casualidad.
  - Anual: arranca el 2/1, omite el 1/1 y agrega el 1/1 del año siguiente en Enero.
  - `:94-106` es JSX sin `return`: código sin efecto.
- **Zona horaria (nota 62). [C]**, probado con `TZ=America/Argentina/Buenos_Aires`:
  - `trainings/training.context.tsx:122` usa `toISOString()`: a las 22:30 del 31/10 pide el Entrenamiento del **01/11**. Desde las 21:00 el Home muestra el día siguiente.
  - `Activity.tsx:57` hace `new Date(training.day)`: `new Date('2026-10-31')` es el **30/10** en Argentina. El día entrenado se pinta un día antes.
  - El formato `YYYY-MM-DD` sale del `toJSON` de `DateType` (`api/node_modules/@mikro-orm/core/types/DateType.js`). **[V]**
- **`trainings` queda en `undefined` (nota 63). [V]** Ver §1.3. Después de tildar, editar o borrar un ítem, `trainings` es `undefined`. `Activity.tsx:56` tira dentro de una función `async` (rechazo silencioso) y la grilla se congela. `deleteTraining` (`:192`) y `addTraining` (`:87`) tiran dentro de su `try`: el servidor ya aplicó el cambio y el client registra un error.
- **`DayRoutine` no se sincroniza (nota 64). [V]** `components/DayRoutine.tsx:42-56` llama a `getTrainingToDay` y en la misma línea copia `training` al estado local, antes de la respuesta. En la primera carga `localTraining` queda en el inicial, con `idTraining: -1`. El nombre y los ítems salen del contexto (`:88`, `:129`), pero el checkbox y las horas del local. Resultado: checkbox siempre destildado, horas vacías, y tildarlo pega `PUT /trainings/-1/user`, que da 500 (`findOneOrFail`, `api/trainings/trainings.controllers.ts:70`). Pasa también sin Entrenamiento ("Empty"). Las horas son editables pero no se guardan nunca (`:95-110`), y el comentario "cada 3 minutos" (`:39`) no tiene intervalo.
- **El ✓ guarda siempre el primer ítem (nota 65). [V]** `TraningDay.tsx:226`: `localTraining.trainingItems[0]`, sin importar la fila. Editás la fila 3, tocás ✓ y se manda la fila 1; lo escrito se ve bien hasta recargar. `isEditedTItem` es uno solo para toda la tabla (`:107,437`).
- **Crear Entrenamiento (nota 66). [V]**
  - Sin fechas elegidas el `for` no corre: no se crea nada, el diálogo no se cierra (`:175-191`) y aun así sale "Training created".
  - Después de crear, `localTraining` queda con `idTraining: -1` y el nombre escrito (`:170-174`): sigue "Create Training" y no aparece "Add exercise" hasta volver a tocar el día.
  - El `for` llama `addTraining` sin esperar, con la clausura de `trainings` (`training.context.tsx:87`): solo sobrevive el último en estado.
- **Alta de Ítem optimista (nota 67). [V]** `TraningDay.tsx:253-255` agrega la fila sin esperar y con `idTrainingItem: 0` (`:90`). Los defaults (`sets: 0`, `reps: 0`, ejercicio con id 0) dan 400 o 404. La fila queda en pantalla con toast de éxito y no se puede borrar ni editar.
- **`training` del contexto desincronizado (nota 68). [V]** Ninguna mutación actualiza `training`. `TrainingDay` no lo pide al montar (`:115-117`): al volver a `/calendar` la fecha es hoy, pero se ve el último día consultado. Si el GET falla, se queda el anterior bajo la fecha nueva (`training.context.tsx:125-131`). Clics rápidos pueden pisarse. **[S]** `date` no está en las dependencias de `:120-126`, tapado por el `eslint-disable` de `:1`.

### 2.6 Ejercicios

- **Editar falla o pierde Grupos musculares (nota 70). [V]** `exercises/exercise.context.tsx:63-69` asume nombres. Si la tabla tiene datos de `GET /exercises` (después de agregar o borrar, ver abajo), `[0].toString()` da `[object Object]`, `muscleGroups` va vacío y `trainingMethod` va como objeto: la API responde 400 (`api/exercises/exercises.schema.ts:9`) y la edición no se guarda, sin aviso. Si viene del filtro por Grupo muscular, pasa, pero se manda solo el primer grupo (`:68`): un Ejercicio con varios pierde los demás (potencial: en el dump ninguno tiene más de uno). La tabla muestra `[object Object]` (`exercise-table/columns.tsx:93`).
- **Edición en tabla inestable (nota 71). [V]** `exercise-table/page.tsx:26` llama a `columns()` en cada render, y `createEditableCell` crea funciones nuevas. `flexRender` las usa como componentes (`node_modules/@tanstack/react-table/build/lib/index.mjs:20-25`): tipo nuevo, remonta. Por eso `useState`/`useEffect` adentro necesitan el `eslint-disable rules-of-hooks` (`:1`). El `onBlur` manda `editedExercise` sin el cambio (`:42-47`) y cada blur es un PUT. Clic en ✓ con un input en foco: el blur re-renderiza y remonta el botón antes del `click`. **[S]**
- **Listas desincronizadas (nota 72). [V]**
  - `handleAddExercise` (`MuscleGroups.tsx:129-132`) dispara POST y dos GET a la vez: los GET pueden no ver el ejercicio nuevo.
  - El form no se limpia.
  - `getExercises()` sin argumento reemplaza `exercises`: el diálogo de "Legs" pasa a mostrar todos.
  - `removeExercise` hace lo mismo (`exercise.context.tsx:103-104`).
  - `editarExercise` y `removeExercise` no tocan `allExercises`: "Tus ejercicios" queda desactualizada.
  - Al abrir un Grupo muscular se ven por un momento las filas del anterior.

### 2.7 Controles y datos falsos

- **Controles que no hacen nada (nota 75). [V]** "Sign in with Google" y "Or sign up with Google" no tienen `type`: **hacen submit del form** (`LoginPage.tsx:83`, `RegisterPage.tsx:127`). Remember me (`LoginPage.tsx:69`, `RegisterPage.tsx:121`), Forgot your password (`LoginPage.tsx:73`), Settings (`Header.tsx:69`), `CalendarHome` y las horas de `DayRoutine`.
- **Avatar falso de un tercero (nota 82). [V]** `Header.tsx:58` manda el nombre de usuario a `i.pravatar.cc`.
- **Logo roto en build (nota 76). [C]** `components/ui/logo.tsx:5` usa `./public/LogoWaby.svg`; el build copia `public/` a la raíz y no existe `dist/public/`.
- **`/profile` sin navegación (nota 74). [V]**

### 2.8 Calidad que tapa bugs

- **`eslint-disable` que esconden problemas (nota 78). [C]** Hay 5 archivos con `exhaustive-deps` apagado completo (`Activity.tsx:1`, `exercise-table2/page.tsx:1`, `MuscleGroups.tsx:1`, `TraningDay.tsx:1`, `pages/User/main.tsx:1`), más `CreatePage.tsx:15`, `DayRoutine.tsx:55` y `rules-of-hooks` en `columns.tsx:1`. Justo donde están varios de los bugs de arriba. `Activity.tsx:52` es un `console.log` suelto que no hace nada, y ninguna regla activa lo detecta.
- **Issue #8 cerrado, pero sigue vigente. [C]** Quedan 8 `console.*` en `client/src` (por ejemplo `NavBar.tsx:8`, `TraningDay.tsx:154-187`), `LoginPage.tsx:27-37` sigue mandando campos de registro y hay varios componentes por archivo.
- **Código muerto (nota 77). [C]** Además de los componentes de §1.2: `users/user.schema.ts`, `getTrainingItem`, `getMG`, `getTraining`, `ui/form.tsx` con el `FormProvider`/`useForm` de `App.tsx:15,20,24`, `ui/progress.tsx`, `ui/scroll-area.tsx`, y dependencias sin uso como `embla-carousel-react` y `@hookform/resolvers`.

## 3. Mejoras

### Entra en 1.0

| Mejora | Evidencia | Nota |
|---|---|---|
| Quitar o resolver los controles sin función | §2.7 | 75 |
| Navegación en `/profile` | `pages/User/main.tsx:13-17` | 74 |
| Validación en formularios | §2.4 | 73 |
| Accesibilidad demostrable: `NavBar` y tarjetas son `div` con `onClick` (`NavBar.tsx:24-46`, `MuscleGroups.tsx:140-144`); botones de ícono sin nombre (`TraningDay.tsx:425-455`, `columns.tsx:107-144`); inputs sin label (`LoginPage.tsx:54,61`, `ProfileForm.tsx:58-66`); ids duplicados (`TraningDay.tsx:314,599,667`, `:354`); `focus:outline-none`; `CommandItem` con `onClickCapture` no se elige con teclado (`:376`); logo sin `alt`; `<html lang="en">` | citas | 79 |
| Textos: la UI mezcla inglés y español (`AGENTS.md` pide español) y dice "routines", "Calisthenics" y "Gym" (`CONTEXT.md`: Entrenamiento, Calistenia, Gimnasio) | `Welcome.tsx:10`, `RegisterPage.tsx:114,116`, `index.html:7` | 80 |
| Layout: anchos fijos de 400 px, `w-screen` y `min-w-full` (`BoxContainer` en 6 componentes, `data-table.tsx:34`, `ProfileForm.tsx:51`). `ScrollArea` de Radix sin `Viewport` (`data-table.tsx:16,34`). Tabla de 9 columnas en 400 px. Visible en pantallas angostas **[S]** | citas | 81 |
| Estados de carga: no hay ninguno (`grep` vacío). Mientras carga se ve "Empty" (`DayRoutine.tsx:88`) | cubierto por issue #9 | |
| Pantalla de error, ruta `*` y boundary | cubierto por issue #13 | |

### Después de 1.0

- **Librería de datos** (por ejemplo TanStack Query): resuelve carreras, caché y estados de carga. Es una dependencia nueva, así que requiere decisión.
- **Code splitting**: el bundle pesa 654 kB. **[C]** No afecta la demo.
- **UI de Progresiones**: no hay pantalla, y las de segundos no están montadas (nota 04). Decidir con Meca si entra.
- **Cookie `httpOnly`**: hoy no se puede porque el front lee el token; se destraba con la nota 54.

## 4. Tests

**No hay ninguno.** **[C]** `@types/jest` está instalado sin Jest (`client/package.json`).

**Herramientas propuestas**: Vitest (3.x acepta Vite 5, según `npm view`), React Testing Library 16 (acepta React 18), MSW para simular la API y Playwright para el flujo completo. Agregarlas no cambia versiones existentes, pero `AGENTS.md` pide preguntar antes de sumar dependencias. **[C]**

| Prioridad | Qué | Por qué | Herramienta | Qué necesita el código | Nota |
|---|---|---|---|---|---|
| 1 | Setup: script `test`, config, entorno jsdom | Sin esto no hay nada | Vitest | Nada | 83 |
| 2 | Lógica pura: grilla de `Activity`, conversión de fechas con `TZ` fija, decodificación del token | Son bugs confirmados y baratos de cubrir | Vitest | Sacar esa lógica de los componentes (`Activity.tsx:27-64`, `training.context.tsx:122`, `Header.tsx:12-19`) | 84 |
| 3 | Contrato y contextos: `AuthContext`, `TrainingContext`, `ExerciseContext` con respuestas reales | Es donde más se rompe | RTL + MSW | Sacar `BrowserRouter` de `App` (`App.tsx:29`) para poder usar `MemoryRouter` | 85 |
| 4 | `ProtectedRoute`: recarga, no autenticado, sesión vencida | Crítico para la demo | RTL + MSW | Lo mismo que arriba | 85 |
| 5 | Formularios: registro y crear Ejercicio | Regresiones visibles | RTL | Nada especial | 85 |
| 6 | Flujo de la demo: registro → login → Ejercicio → Entrenamiento → calendario → Sobrecarga progresiva | Es lo que se presenta | Playwright | Notas 09 y 50 | 86 |

## 5. Refactors

Solo los que tienen un motivo concreto.

| Refactor | Motivo | Si no se hace | Nota |
|---|---|---|---|
| **Capa de datos y tipos de contrato** | `Exercise.muscleGroups` es `number[]`, pero la API manda objetos en un GET y strings en otro (§1.3). La misma interfaz se usa para leer y escribir. Hay 3 definiciones más de `Exercise` (`exercise-table/page.tsx:7`, `exercise-table2/columns.tsx:4`, `exercise-table2/page.tsx:8`) y 2 de `Training`. Son 22 bloques `catch` casi iguales en 5 contextos cuyos errores nadie lee | Parchear la nota 02 con un cast tapa el error de `tsc` sin arreglar el contrato; los bugs 63, 69 y 70 reaparecen en cada función nueva | 87 |
| **`TraningDay.tsx` (709 líneas)** | Un componente con 10 handlers y 3 diálogos: el estado local copia al contexto, y de ahí salen las notas 65 a 68. Dos `<Dialog>` comparten `isCreateDialogOpen` (`:465,628`). El nombre del archivo tiene un error | Cada arreglo toca el mismo archivo, se hace difícil de testear y de repartir con Franco | 88 |
| **`MuscleGroups.tsx`** | 6 `case` idénticos (`:55-100`) que hacen lo mismo con un nombre distinto, y polling cada 3 minutos de catálogos que no cambian (`:44,107,117`) | Un Grupo muscular nuevo en la base no carga ejercicios; pedidos innecesarios | 89 |

**No propongo**: unificar `data-table.tsx` y `data-table-allExercises.tsx` (son casi iguales pero no causan bugs), sacar los `forwardRef` de shadcn (issue #10, cerrado, es código generado) ni renombrar `editarExercise` salvo que se toque por otra cosa.

## 6. Conclusiones y preguntas abiertas

### Conclusiones

- **Hay producto, no está listo.** Las pantallas existen y el contrato de rutas está casi entero (solo una ruta no existe, y es código muerto). Lo que falla es la forma de los datos y la sincronización de estado.
- **El orden importa**: primero decidir la base (50), después el build (02) y el registro (51), después sesión (52 a 58), y recién ahí Home y `/calendar`. Arreglar sobre `main` y mergear la rama después duplica trabajo: varios archivos difieren.
- **Muchos hallazgos salen de lo mismo** (55, 57, 63, 69, 70, 72): la capa de datos asume formas que la API no devuelve y no reporta resultados. Conviene arreglar eso con criterio (87) y no nota por nota.
- **El reparto pesa.** La mayoría de las notas son de pantallas, y el reparto propuesto se las deja a Franco, al que todavía no se le contó la propuesta. Son 40 notas para dos meses: no todas entran, y las P2 son las primeras en caer.

### Preguntas abiertas

- ¿Cuál es la base de Waby 1.0: `main` con la rama integrada, o la rama con el monorepo aplicado encima? (nota 50)
- ¿Quién toma las pantallas: Elias o Franco?
- ¿Qué exige Meca? De eso depende si entran los tests E2E, la accesibilidad, las Progresiones y el deploy (reunión pendiente).
- ¿Se puede más de un Entrenamiento por día? La API lo permite al crear, pero `findOne` muestra uno solo.
- ¿Los Ejercicios tienen uno o varios Grupos musculares? El modelo dice varios, el form de alta y la edición manejan uno.
- ¿Google, "recordarme" y "olvidé mi contraseña" se implementan o se sacan?
- Idioma y términos de la UI: ¿todo en español y qué término reemplaza a "routines"? (`CONTEXT.md`, "Rutina")

### Sin confirmar

No se abrió la app ni se levantó la base. Todo lo marcado **[V]** o **[S]** falta comprobarlo recorriendo el flujo, tarea que ya figura en el checklist de la fase 1 del vault. Lo más importante de confirmar: el 500 del segundo registro con `phone: ''`, el comportamiento de la cookie `secure` en `http://localhost` según navegador, y qué pasa al eliminar el perfil.
