import type { MuscleGroup as MuscleGroupDto } from '@waby/shared';
import type { MuscleGroup } from './muscleGroup.entity.js';

export function toMuscleGroupDto(group: MuscleGroup): MuscleGroupDto {
    return {
        id: group.id,
        name: group.name,
        description: group.description,
        image: group.image ?? null,
    };
}
