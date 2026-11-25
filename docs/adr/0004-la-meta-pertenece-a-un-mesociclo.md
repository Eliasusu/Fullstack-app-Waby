# ADR-0004: La Meta pertenece a un Mesociclo

- **Estado**: Aceptado
- **Fecha**: 2026-11-25
- **Autores**: Elias Palamidessi

## Contexto

Para la aprobación directa, los dos casos de uso tienen que estar relacionados: lo que registra uno es input del otro. ADR-0003 dejó esa relación implícita: una Meta avanzaba con los Ítems completados dentro de sus fechas, y esos Ítems podían venir o no de un Mesociclo.

En la consulta del 24/11, la cátedra marcó que falta unir el Mesociclo con la Meta.

## Decisión

La Meta pertenece a un Mesociclo, y su progreso sale de los Entrenamientos de ese Mesociclo. Reemplaza en ADR-0003 la fila de `Goal`, la regla "Progreso derivado" y la consecuencia "Relación entre los dos casos de uso".

- `Goal` pierde `startDate` y `endDate` y suma `mesocycle?`. El período lo define el Mesociclo.
- El Mesociclo es obligatorio al crear la Meta y se puede cambiar por otro, pero no quitar a mano (`CreateGoalSchema` y `UpdateGoalSchema`).
- Si se borra el Mesociclo, la Meta queda sin él (`ON DELETE SET NULL`) y sin progreso.
- **Progreso derivado:** el mejor valor, según `targetType`, entre los Ítems completados del Ejercicio de la Meta en los Entrenamientos que apuntan a su Mesociclo. Las fechas no se miran. La Meta está lograda cuando ese valor llega al objetivo.

## Alternativas consideradas

- **Mantener la relación por fechas** y mostrar de qué Mesociclo salió el avance: la relación sigue sin estar en el modelo, y un Entrenamiento suelto en esas fechas también mueve la Meta.
- **Cargar el progreso a mano desde la Meta**, eligiendo el Mesociclo: suma una pantalla y no hace falta para relacionar los casos de uso. Queda en el backlog, y si se hace crea un Ítem completado: el progreso sigue siendo derivado.
- **Borrar las Metas en cascada o responder 409 al borrar el Mesociclo:** se prefirió no perder la Meta y que quede sin progreso hasta que se le asigne otro Mesociclo.

## Consecuencias

- La relación entre "Crear rutina para un Mesociclo" y "Registrar una Meta" es explícita: los Entrenamientos que arma el primero son el input del segundo.
- El cálculo es más simple: se filtra por clave foránea, sin rangos de fechas.
- Como el esquema se actualiza con `updateSchema()`, las Metas existentes pierden sus fechas y quedan sin Mesociclo. El seed se rehace con `pnpm seed`.
