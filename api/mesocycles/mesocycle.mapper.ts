import { mesocycleEndDate, type Mesocycle as MesocycleDto } from '@waby/shared';
import type { Mesocycle } from './mesocycle.entity.js';

export function toMesocycleDto(mesocycle: Mesocycle, trainingsCount: number): MesocycleDto {
    return {
        id: mesocycle.id,
        name: mesocycle.name,
        type: mesocycle.type,
        startDate: mesocycle.startDate,
        weeks: mesocycle.weeks,
        endDate: mesocycleEndDate(mesocycle.startDate, mesocycle.weeks),
        trainingsCount,
    };
}
