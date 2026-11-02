import { z } from 'zod';

/** Id autoincremental de cualquier entidad, en el body de un request. */
export const IdSchema = z.number().int().positive();

/** Id en un parámetro de ruta (`/exercises/:id`): llega como texto. */
export const IdParamSchema = z.coerce.number().int().positive();

/** Fecha sin hora, `YYYY-MM-DD`. Evita los corrimientos por zona horaria. */
export const DateOnlySchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha tiene que tener el formato AAAA-MM-DD')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'La fecha no es válida');

/** Fecha y hora en ISO 8601, como la serializa `JSON.stringify` de un `Date`. */
export const DateTimeSchema = z.string().datetime({ offset: true });

/** Hoy en hora local, como `YYYY-MM-DD`. */
export function todayDateOnly(): string {
    return new Date().toLocaleDateString('sv-SE');
}

/** Referencia mínima a otra entidad dentro de una respuesta. */
export const RefSchema = z.object({
    id: z.number().int(),
    name: z.string(),
});
export type Ref = z.infer<typeof RefSchema>;

/** Forma de error de validación que devuelve la API (400). */
export const ValidationErrorSchema = z.object({
    message: z.string(),
    issues: z.array(
        z.object({
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string(),
        }),
    ),
});
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
