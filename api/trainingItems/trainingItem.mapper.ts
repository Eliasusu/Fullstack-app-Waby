import type { TrainingItem as TrainingItemDto } from '@waby/shared';
import { toExerciseRef } from '../exercises/exercise.mapper.js';
import type { TrainingItem } from './trainingItem.entity.js';

/** Requiere `exercise` cargado. */
export function toTrainingItemDto(item: TrainingItem): TrainingItemDto {
    return {
        id: item.id,
        trainingId: item.training.id,
        exercise: toExerciseRef(item.exercise),
        sets: item.sets,
        reps: item.reps ?? null,
        seconds: item.seconds ?? null,
        weightKg: item.weightKg ?? null,
        restSeconds: item.restSeconds ?? null,
        comment: item.comment ?? null,
        completed: item.completed,
    };
}
