import { z } from 'zod';
import { DateOnlySchema } from './common.js';
import { MesocycleTypeSchema } from './enums.js';

/** Mesociclo tal como lo devuelve la API. `endDate` y `trainingsCount` son derivados. */
export const MesocycleSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    type: MesocycleTypeSchema,
    startDate: DateOnlySchema,
    weeks: z.number().int(),
    endDate: DateOnlySchema,
    trainingsCount: z.number().int(),
});
export type Mesocycle = z.infer<typeof MesocycleSchema>;

export const CreateMesocycleSchema = z
    .object({
        name: z.string().trim().min(1).max(100),
        type: MesocycleTypeSchema,
        startDate: DateOnlySchema,
        weeks: z.number().int().min(1).max(52),
    })
    .strict();
export type CreateMesocycleInput = z.infer<typeof CreateMesocycleSchema>;

export const UpdateMesocycleSchema = CreateMesocycleSchema.partial();
export type UpdateMesocycleInput = z.infer<typeof UpdateMesocycleSchema>;

/** Último día del Mesociclo (inclusive): `startDate + weeks * 7 - 1`. */
export function mesocycleEndDate(startDate: string, weeks: number): string {
    const date = new Date(`${startDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + weeks * 7 - 1);
    return date.toISOString().slice(0, 10);
}
