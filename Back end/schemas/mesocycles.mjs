import{ z } from 'zod';
import { Routine } from './routine.ts';

export const mesocyclesSchema = z.object({
    typeMesocycle: z.string({
        required_error: 'Type of mesocycle is required',
        invalid_type_error: 'Type of mesocycle must be a string',
        format_error: 'Type of mesocycle must be one of the following: "Strength", "Hypertrophy", "Endurance"',
    }),
    routines: z.array(z.object({
        required_error: 'Routine is required',
        invalid_type_error: 'Routine must be an object',
    })),
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
    }).date('date', {
        invalid_type_error: 'End date must be a date',
        format_error: 'End date must have the format YYYY-MM-DD',
    }),
});

export function validateMesocycles(mesocycles) {
    return mesocyclesSchema.safeParse(mesocycles);
}

export function validateParcialMesocycles(mesocycles) {
    return mesocyclesSchema.partial().safeParse(mesocycles);
}
