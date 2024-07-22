import{ z } from 'zod';

export const mesocyclesSchema = z.object({
    idMesocycle: z.number().int().positive(),
    typeMesocycle: z.string({
        required_error: 'Type of mesocycle is required',
        invalid_type_error: 'Type of mesocycle must be a string',
    }),
    startDate: z.date({
        required_error: 'Start date is required',
        invalid_type_error: 'Start date must be a date',
    }),
    endDate: z.date({
        required_error: 'End date is required',
        invalid_type_error: 'End date must be a date',
    }),
});

type Mesocycles = z.infer<typeof mesocyclesSchema>;

export function validateMesocycles(mesocycles: Mesocycles) {
    const startDate = new Date(mesocycles.startDate);
    const endDate = new Date(mesocycles.endDate);
    return mesocyclesSchema.safeParse(mesocycles = {...mesocycles, startDate, endDate});
}

export function validateParcialMesocycles(mesocycles: Mesocycles) {
    if(mesocycles.startDate) mesocycles.startDate = new Date(mesocycles.startDate);
    if(mesocycles.endDate) mesocycles.endDate = new Date(mesocycles.endDate);
    return mesocyclesSchema.partial().safeParse(mesocycles);
}
