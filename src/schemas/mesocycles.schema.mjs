<<<<<<< HEAD:src/schemas/mesocycles.mjs
=======
import{ z } from 'zod';
import { Routine } from './routine.ts';

export const mesocyclesSchema = z.object({
    typeMesocycle: z.string({
        required_error: 'Type of mesocycle is required',
        invalid_type_error: 'Type of mesocycle must be a string',
    }),
    startDate: z.string({
        required_error: 'Start date is required',
        invalid_type_error: 'Start date must be a string',
    }).date('date', {
        invalid_type_error: 'Start date must be a date',
        format_error: 'Start date must have the format YYYY-MM-DD',
    }),
    endDate: z.string({
        required_error: 'End date is required',
        invalid_type_error: 'End date must be a string',
    }),
});

export function validateMesocycles(mesocycles) {
    return mesocyclesSchema.safeParse(mesocycles);
}

export function validateParcialMesocycles(mesocycles) {
    return mesocyclesSchema.partial().safeParse(mesocycles);
}
>>>>>>> origin/feature/usuario:src/schemas/mesocycles.schema.mjs
