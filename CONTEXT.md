# CONTEXT — Waby

Glosario y modelo de dominio de Waby. Es la fuente de verdad para los nombres: si un término del código, la UI o los issues no coincide con este archivo, se corrige uno de los dos y se deja registrado.

## Qué es Waby

App para personas con experiencia entrenando que arman sus propios ejercicios y entrenamientos, los planifican en un calendario y siguen la sobrecarga progresiva. Proyecto de la facultad (UTN FRRo) de Franco Libera y Elias Palamidessi.

El objetivo de este repo es **Waby 1.0**: la app web (React + Express) terminada y presentada a la cátedra.

## Glosario

| Término | En el código | Definición |
|---|---|---|
| **Usuario** | `User` | Persona que entrena. Tiene peso corporal y altura, como valores fijos. Su nivel de acceso es `USER` o `ADMIN`. |
| **Admin** | `role: ADMIN` | Usuario que gestiona los catálogos: Métodos de entrenamiento y Grupos musculares. |
| **Método de entrenamiento** | `TrainingMethod` | Disciplina a la que pertenece un Ejercicio. Valores cargados: *Calistenia* y *Gimnasio*. Es un catálogo. |
| **Grupo muscular** | `MuscleGroup` | Zona trabajada (Espalda, Pecho, Brazos, Hombros, Piernas, Core). Un Ejercicio tiene varios. Es un catálogo. |
| **Ejercicio** | `Exercise` | Movimiento que el Usuario crea en su biblioteca. El nombre es único para cada Usuario. Tiene dificultad, patrón de movimiento y forma de medirse. |
| **Patrón de movimiento** | `movementPattern` | `PUSH`, `PULL`, `LEGS` o `CORE`. |
| **Forma de medir** | `metricType` | `REPS` (repeticiones) o `TIME` (segundos, para holds e isométricos). Define qué campos llevan los Ítems, las Progresiones y las Metas de ese Ejercicio. |
| **Progresión** | `Progression` | Escalón ordenado de un Ejercicio, con las series y las reps (o los segundos) necesarios para pasar al siguiente. |
| **Mesociclo** | `Mesocycle` | Bloque de entrenamiento de varias semanas, de tipo Fuerza, Hipertrofia o Descarga, que agrupa Entrenamientos. |
| **Entrenamiento** | `Training` | Lo planificado para un día: nombre, fecha y si se completó. Puede pertenecer a un Mesociclo o estar suelto. |
| **Ítem de entrenamiento** | `TrainingItem` | Un Ejercicio dentro de un Entrenamiento: series, reps o segundos, peso opcional en kg, descanso y comentario. Es plan. Completarlo significa que se hizo tal cual. |
| **Meta** | `Goal` | Objetivo sobre un Ejercicio (reps, peso o segundos) con fecha de inicio y, opcionalmente, de fin. |
| **Sobrecarga progresiva** | (derivado) | El progreso de una Meta: el mejor valor entre los Ítems completados de su Ejercicio dentro de sus fechas. No se guarda. |

## Términos que no se usan

- **Rutina**: decía cosas distintas en el README, en la propuesta y en la ruta `/routines`. En la UI y en los casos de uso se habla de Entrenamientos de un Mesociclo.

Decisiones del modelo: `docs/adr/0003-modelo-de-dominio-1-0.md`.
