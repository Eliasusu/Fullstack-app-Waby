import{ z } from 'zod';

export const mesocyclesSchema = z.object({

});

export function validateMesocycles(mesocycles) {
    return mesocyclesSchema.safeParse(mesocycles);
}

export function validateParcialMesocycles(mesocycles) {
    return mesocyclesSchema.partial().safeParse(mesocycles);
}
