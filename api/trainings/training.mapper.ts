import type { Training as TrainingDto, TrainingWithItems } from '@waby/shared';
import { toTrainingItemDto } from '../trainingItems/trainingItem.mapper.js';
import type { Training } from './training.entity.js';

/** Requiere `mesocycle` cargado (si tiene). */
export function toTrainingDto(training: Training): TrainingDto {
    return {
        id: training.id,
        name: training.name,
        day: training.day,
        completed: training.completed,
        mesocycle: training.mesocycle ? { id: training.mesocycle.id, name: training.mesocycle.name } : null,
    };
}

/** Requiere `mesocycle`, `items` e `items.exercise` cargados. */
export function toTrainingWithItemsDto(training: Training): TrainingWithItems {
    return {
        ...toTrainingDto(training),
        items: training.items
            .getItems()
            .sort((a, b) => a.id - b.id)
            .map(toTrainingItemDto),
    };
}
