import type { Goal as GoalDto } from '@waby/shared';
import { toExerciseRef } from '../exercises/exercise.mapper.js';
import type { Goal } from './goal.entity.js';
import type { GoalProgress } from './goal-progress.js';

/** Requiere `exercise` y `mesocycle` cargados. El progreso se calcula aparte (`computeGoalProgress`) porque consulta la base. */
export function toGoalDto(goal: Goal, progress: GoalProgress): GoalDto {
    return {
        id: goal.id,
        exercise: toExerciseRef(goal.exercise),
        mesocycle: goal.mesocycle ? { id: goal.mesocycle.id, name: goal.mesocycle.name } : null,
        targetType: goal.targetType,
        targetValue: goal.targetValue,
        ...progress,
    };
}
