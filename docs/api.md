# API de Waby

Documentación de la API REST del backend (`@waby/api`). Los cuerpos de request y response están definidos como esquemas Zod en `@waby/shared` (`shared/src/`): la tabla de cada recurso dice qué esquema usa cada endpoint. Esta documentación y los tests de integración (`api/test/`) describen el mismo contrato. Si cambia uno, cambia el otro.

- **Base:** `http://localhost:3000/api/v1`
- **Formato:** JSON (`Content-Type: application/json`).
- **Fechas:**
  - Las fechas sin hora van como `YYYY-MM-DD`.
  - Las fechas con hora van en ISO 8601.
- **Ids:** enteros autoincrementales.
- **Relaciones:**
  - En los requests se mandan ids (`trainingMethodId`, `muscleGroupIds`).
  - En las respuestas vienen objetos anidados de un nivel (`trainingMethod: { id, name }`).
- **Campos desconocidos:** un body con campos que el esquema no conoce responde 400. Así nadie puede mandar `role` o `user` en un alta.

## Autenticación y niveles de acceso

- **Sesión:**
  - El login y el registro dejan una cookie `token` (`httpOnly`, `sameSite=lax`) con un JWT que dura 1 hora.
  - El JWT lleva el id y el rol del usuario.
  - El client la manda con `withCredentials: true`.
- **Niveles:**

  | Nivel | Qué puede hacer |
  |---|---|
  | **Público** | Entrar sin sesión |
  | **Usuario** | Con sesión, cualquier rol. Solo ve y modifica sus propios datos |
  | **Admin** | Con sesión de rol `ADMIN`. Gestiona los catálogos y ve la lista de usuarios |

- **Recursos ajenos:** un recurso de otro usuario responde **404**, igual que uno que no existe. Así no se puede averiguar qué ids existen.

## Errores

| Código | Cuándo | Body |
|---|---|---|
| 400 | Body, query o parámetro inválido | `ValidationError`: `{ message, issues: [{ path, message }] }` |
| 401 | Sin sesión, sesión vencida o credenciales incorrectas | `{ message }` |
| 403 | Con sesión, pero sin el nivel que pide la ruta | `{ message }` |
| 404 | El recurso no existe o es de otro usuario | `{ message }` |
| 409 | Choca con otro dato: nombre repetido, o borrar algo que está en uso | `{ message }` |
| 500 | Error inesperado. No expone detalles internos | `{ message }` |

## Salud

| Método | Ruta | Nivel | Respuesta |
|---|---|---|---|
| GET | `/health` | Público | 200 `{ status: 'ok' }` |

## Auth

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| POST | `/auth/register` | Público | `RegisterSchema` | 201 `User` + cookie | 400, 409 (usuario o email repetido) |
| POST | `/auth/login` | Público | `LoginSchema` | 200 `User` + cookie | 400, 401 |
| POST | `/auth/logout` | Público | — | 204, y borra la cookie | — |

Todo usuario nuevo tiene rol `USER`. El primer admin lo crea el seed (`pnpm --filter @waby/api seed`).

## Usuarios

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/users/me` | Usuario | — | 200 `User` | 401 |
| PATCH | `/users/me` | Usuario | `UpdateUserSchema` | 200 `User` | 400, 401, 409 |
| DELETE | `/users/me` | Usuario | — | 204, y borra la cookie y todos sus datos | 401 |
| GET | `/users` | Admin | — | 200 `User[]` | 401, 403 |

Un `User` nunca incluye la contraseña. Si se manda `password` en el `PATCH`, se guarda hasheada.

## Métodos de entrenamiento (catálogo)

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/training-methods` | Público | — | 200 `TrainingMethod[]` | — |
| GET | `/training-methods/:id` | Público | — | 200 `TrainingMethod` | 400, 404 |
| POST | `/training-methods` | Admin | `CreateTrainingMethodSchema` | 201 `TrainingMethod` | 400, 401, 403, 409 |
| PATCH | `/training-methods/:id` | Admin | `UpdateTrainingMethodSchema` | 200 `TrainingMethod` | 400, 401, 403, 404, 409 |
| DELETE | `/training-methods/:id` | Admin | — | 204 | 401, 403, 404, 409 (en uso) |

Los listados son públicos porque el registro los necesita antes de que haya sesión.

## Grupos musculares (catálogo)

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/muscle-groups` | Usuario | — | 200 `MuscleGroup[]` | 401 |
| GET | `/muscle-groups/:id` | Usuario | — | 200 `MuscleGroup` | 400, 401, 404 |
| POST | `/muscle-groups` | Admin | `CreateMuscleGroupSchema` | 201 `MuscleGroup` | 400, 401, 403, 409 |
| PATCH | `/muscle-groups/:id` | Admin | `UpdateMuscleGroupSchema` | 200 `MuscleGroup` | 400, 401, 403, 404, 409 |
| DELETE | `/muscle-groups/:id` | Admin | — | 204 | 401, 403, 404, 409 (en uso) |

## Ejercicios

| Método | Ruta | Nivel | Body / query | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/exercises` | Usuario | `?muscleGroupId=&trainingMethodId=` (opcionales) | 200 `Exercise[]` | 400, 401 |
| GET | `/exercises/:id` | Usuario | — | 200 `Exercise` | 400, 401, 404 |
| POST | `/exercises` | Usuario | `CreateExerciseSchema` | 201 `Exercise` | 400, 401, 409 (nombre repetido) |
| PATCH | `/exercises/:id` | Usuario | `UpdateExerciseSchema` | 200 `Exercise` | 400, 401, 404, 409 |
| DELETE | `/exercises/:id` | Usuario | — | 204 | 401, 404, 409 (en uso) |

- **Nombre:** es único para cada usuario. Dos usuarios pueden tener un Ejercicio con el mismo nombre.
- **Método y grupos musculares:** `trainingMethodId` y `muscleGroupIds` tienen que existir. Si no, responde 400.
- **Borrado:** un Ejercicio que está en algún Ítem o en una Meta no se puede borrar y responde 409. Se borran sus Progresiones.
- **`metricType`:** no se puede cambiar si el Ejercicio ya tiene Ítems, Progresiones o Metas. Responde 409.

## Progresiones

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/exercises/:id/progressions` | Usuario | — | 200 `Progression[]`, ordenadas por `order` | 400, 401, 404 |
| POST | `/exercises/:id/progressions` | Usuario | `CreateProgressionSchema` | 201 `Progression` | 400, 401, 404, 409 |
| PATCH | `/exercises/:id/progressions/:progressionId` | Usuario | `UpdateProgressionSchema` | 200 `Progression` | 400, 401, 404, 409 |
| DELETE | `/exercises/:id/progressions/:progressionId` | Usuario | — | 204 | 401, 404 |

- **Volumen:** una Progresión lleva `reps` si el Ejercicio es `REPS`, o `seconds` si es `TIME`. La regla está en `volumeError` (`shared/src/rules.ts`). Si no se cumple, responde 400.
- **Únicos dentro del Ejercicio:** `name` y `order`.

## Mesociclos

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/mesocycles` | Usuario | — | 200 `Mesocycle[]` | 401 |
| GET | `/mesocycles/:id` | Usuario | — | 200 `Mesocycle` | 400, 401, 404 |
| GET | `/mesocycles/:id/trainings` | Usuario | — | 200 `Training[]`, ordenados por día | 400, 401, 404 |
| POST | `/mesocycles` | Usuario | `CreateMesocycleSchema` | 201 `Mesocycle` | 400, 401 |
| PATCH | `/mesocycles/:id` | Usuario | `UpdateMesocycleSchema` | 200 `Mesocycle` | 400, 401, 404 |
| DELETE | `/mesocycles/:id` | Usuario | — | 204 | 401, 404 |

- **Derivados:** `endDate` y `trainingsCount` se calculan, no se guardan.
- **Borrado:** al borrar un Mesociclo, sus Entrenamientos quedan sueltos (`mesocycle: null`) y no se borran.
- **Asociación:** un Entrenamiento se asocia a un Mesociclo con `mesocycleId` al crearlo o editarlo.

## Entrenamientos

| Método | Ruta | Nivel | Body / query | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/trainings` | Usuario | `?from=YYYY-MM-DD&to=YYYY-MM-DD` (opcionales, inclusive) | 200 `Training[]`, ordenados por día | 400, 401 |
| GET | `/trainings/:id` | Usuario | — | 200 `TrainingWithItems` | 400, 401, 404 |
| POST | `/trainings` | Usuario | `CreateTrainingSchema` | 201 `TrainingWithItems` | 400, 401 |
| PATCH | `/trainings/:id` | Usuario | `UpdateTrainingSchema` | 200 `TrainingWithItems` | 400, 401, 404 |
| DELETE | `/trainings/:id` | Usuario | — | 204, y se borran sus Ítems | 401, 404 |

- **`mesocycleId`:** tiene que ser un Mesociclo del usuario. Si no, responde 400. `null` lo desasocia.
- **Varios por día:** un día puede tener varios Entrenamientos. `?from=2026-11-02&to=2026-11-02` devuelve todos los de ese día.

## Ítems de entrenamiento

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| POST | `/trainings/:id/items` | Usuario | `CreateTrainingItemSchema` | 201 `TrainingItem` | 400, 401, 404 |
| PATCH | `/trainings/:id/items/:itemId` | Usuario | `UpdateTrainingItemSchema` | 200 `TrainingItem` | 400, 401, 404 |
| DELETE | `/trainings/:id/items/:itemId` | Usuario | — | 204 | 401, 404 |

- **Ejercicio:** `exerciseId` tiene que ser un Ejercicio del usuario. Si no, responde 400.
- **Volumen:** un Ítem lleva `reps` o `seconds` según el `metricType` del Ejercicio (`volumeError`). Si no se cumple, responde 400.
- **`weightKg`:** vacío significa peso corporal.
- **Plan, no registro:** el Ítem es plan. `completed: true` significa que se hizo tal cual.

## Metas

| Método | Ruta | Nivel | Body | Respuesta | Errores |
|---|---|---|---|---|---|
| GET | `/goals` | Usuario | — | 200 `Goal[]` | 401 |
| GET | `/goals/:id` | Usuario | — | 200 `Goal` | 400, 401, 404 |
| POST | `/goals` | Usuario | `CreateGoalSchema` | 201 `Goal` | 400, 401 |
| PATCH | `/goals/:id` | Usuario | `UpdateGoalSchema` | 200 `Goal` | 400, 401, 404 |
| DELETE | `/goals/:id` | Usuario | — | 204 | 401, 404 |

- **Ejercicio:** `exerciseId` tiene que ser un Ejercicio del usuario. Si no, responde 400.
- **`targetType`:** tiene que ser compatible con el `metricType` del Ejercicio (`isGoalTargetTypeValidFor`). `REPS` admite `REPS` y `WEIGHT`, y `TIME` admite `SECONDS`. Si no, responde 400.
- **`currentValue` y `achieved`:** son derivados.
  - `currentValue` es el mejor valor entre los Ítems **completados** del Ejercicio con día entre `startDate` y `endDate`.
  - Qué valor cuenta depende de `targetType`: reps, `weightKg` o segundos.
  - Si no hay Ítems completados, es `null`.
  - `achieved` es `currentValue >= targetValue`.
