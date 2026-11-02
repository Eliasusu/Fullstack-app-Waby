# ADR-0003: Modelo de dominio de Waby 1.0

- **Estado**: Aceptado
- **Fecha**: 2026-11-02
- **Autores**: Elias Palamidessi

## Contexto

El modelo heredado de 2024 tiene bugs y ambigüedades:

- **Unicidad:** `Exercise.name` es único en toda la base, y `User.phone` también.
- **Nulabilidad:** no coincide con los tipos.
- **Mezcla de ejes:** `typeExercise` mezcla el patrón de movimiento con la forma de medir (`Isometric`).
- **Tipos:** el peso del ítem es texto y no hay campo para segundos.
- **"Rutina":** significa tres cosas distintas.
- **Progresiones:** hay dos clases casi iguales.

Para la aprobación directa también faltan Mesociclo y Meta. La propuesta de 2024 los compromete, y los dos casos de uso tienen que estar relacionados.

## Decisión

Una revisión moderada del modelo: se corrigen los bugs, se separan los ejes de medición y se agregan Mesociclo y Meta. No se agrega registro por serie.

| Entidad | Campos |
|---|---|
| `User` | `username` y `email` únicos, `password` (hash), `name`, `birthdate`, `phone?` (no único), `bodyWeightKg`, `heightCm`, `role: USER \| ADMIN`, `trainingMethods` |
| `TrainingMethod` | `name` (único) y `description`. Catálogo: lo edita el admin |
| `MuscleGroup` | `name`, `description` e `image?`. Catálogo: lo edita el admin |
| `Exercise` | `user`, `name` (único por usuario), `description?`, `trainingMethod`, `muscleGroups`, `difficulty: EASY \| MEDIUM \| HARD`, `movementPattern: PUSH \| PULL \| LEGS \| CORE`, `metricType: REPS \| TIME`, `image?`, `createdAt` |
| `Progression` | `exercise`, `order`, `name` (único por ejercicio), `sets`, y `reps?` o `seconds?` según el `metricType` del Ejercicio. Reemplaza `ProgressionReps` y `ProgressionSec` |
| `Mesocycle` | `user`, `name`, `type: STRENGTH \| HYPERTROPHY \| DELOAD`, `startDate` y `weeks`. La fecha de fin y la cantidad de Entrenamientos se derivan |
| `Training` | `user`, `name`, `day` (`YYYY-MM-DD`), `completed` y `mesocycle?`. Si se borra el Mesociclo, el Entrenamiento queda suelto |
| `TrainingItem` | `training`, `exercise`, `sets ≥ 1`, `reps?` o `seconds?` según `metricType`, `weightKg?` (vacío = peso corporal), `restSeconds?`, `comment?` y `completed` |
| `Goal` | `user`, `exercise`, `targetType: REPS \| WEIGHT \| SECONDS` (validado contra `metricType`), `targetValue`, `startDate` y `endDate?`. Reemplaza `ProgressiveOverload` |

Reglas transversales:

- **IDs:** autoincrementales enteros en todas las entidades.
- **Nombres:** `id`, `name`, `description` e `image`, iguales en todas.
- **Sin cascada a catálogos:** ninguna relación hacia un catálogo usa `cascade: ALL`.
- **Plan, no registro:** un Ítem de entrenamiento es plan. `completed` significa "se hizo tal cual estaba planificado".
- **Progreso derivado:** el progreso de una Meta no se guarda. Es el mejor valor entre los Ítems completados de su Ejercicio dentro de sus fechas, y la Meta está lograda cuando ese valor llega al objetivo.
- **Sin Rutina:** "Rutina" deja de existir en el código. El caso de uso "Crear rutina para un mesociclo" es armar los Entrenamientos de un Mesociclo.
- **Se van del Entrenamiento:** `trainingType`, `startHour` y `endHour`. El tipo de bloque (Fuerza, Hipertrofia, Descarga) pasa al Mesociclo.

Rutas:

| Ruta | Qué cambia |
|---|---|
| `/trainings/:id/items` | Reemplaza `/routines` |
| `/mesocycles` | Nueva |
| `/goals` | Nueva. Devuelve `currentValue` y `achieved` |
| `/exercises/:id/progressions` | Ahora protegida por sesión |

## Alternativas consideradas

- **Arreglar solo los bugs**: deja vivas las ambigüedades que traban la validación (`Isometric`, peso como texto) y la pantalla de Metas.
- **Registro por serie** (sesión con series realizadas y PRs derivados): no lo pide el enunciado y duplica el tamaño del cambio.
- **`metricType` con `WEIGHTED_REPS`**: obliga a tener dos Ejercicios para el mismo movimiento con y sin lastre.
- **Meta con registros cargados a mano**, como la rama de sobrecarga progresiva: no relaciona el caso de uso de la Meta con el del Mesociclo.
- **Subtipos de Meta del DER** (peso corporal, calistenia, gym): más tablas y pantallas sin beneficio para la entrega.
- **Nombre de Ejercicio no único**: permite duplicados que confunden al elegir el Ejercicio de una Meta.

## Consecuencias

- **Base de datos:** el dump de 2024 deja de servir. Como el esquema se genera con `updateSchema()` y no hay migraciones, se arma de cero y un seed carga los datos de demo.
- **Client:** se adapta a nombres de campos, tipos y rutas nuevos.
- **Calendario:** sin horario, muestra los Entrenamientos como eventos de día completo.
- **Relación entre los dos casos de uso:** queda implícita. Los Entrenamientos del Mesociclo son los que mueven la Meta, siempre que las fechas coincidan.
- **Pendiente:** definir quién implementa el cálculo del progreso de la Meta y la asociación de Entrenamientos a un Mesociclo. Son los núcleos de los dos casos de uso.
