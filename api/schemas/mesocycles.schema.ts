import{ z } from 'zod';

export const mesocyclesSchema = z.object({
    idMesocycle: z.string({}).min(1).max(1),
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
    return mesocyclesSchema.safeParse(mesocycles);
}

export function validateParcialMesocycles(mesocycles: Mesocycles) {
    return mesocyclesSchema.partial().safeParse(mesocycles);
}
