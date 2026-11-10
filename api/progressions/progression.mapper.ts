import type { Progression as ProgressionDto } from '@waby/shared';
import type { Progression } from './progression.entity.js';

export function toProgressionDto(progression: Progression): ProgressionDto {
    return {
        id: progression.id,
        exerciseId: progression.exercise.id,
        order: progression.order,
        name: progression.name,
        sets: progression.sets,
        reps: progression.reps ?? null,
        seconds: progression.seconds ?? null,
    };
}
