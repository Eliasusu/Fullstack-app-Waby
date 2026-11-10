import type { TrainingMethod as TrainingMethodDto } from '@waby/shared';
import type { TrainingMethod } from './trainingMethod.entity.js';

export function toTrainingMethodDto(method: TrainingMethod): TrainingMethodDto {
    return {
        id: method.id,
        name: method.name,
        description: method.description,
    };
}
