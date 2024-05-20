import { z } from 'zod';

const wabySchema = z.object({
    nombre: z.string({
        required_error: 'Nombre es requerido',
        invalid_type_error: 'Nombre debe ser un string',
        long_error: 'Nombre debe tener menos de 20 caracteres',
    }),
    mail: z.string({
        required_error: 'Mail es requerido',
        invalid_type_error: 'Mail debe ser un string',
        long_error: 'Mail debe tener menos de 30 caracteres',
    }),
    peso: z.number({
        required_error: 'Peso es requerido',
        invalid_type_error: 'Peso debe ser un número',
    }).int({
        invalid_type_error: 'Peso debe ser un número entero',
    }).positive({
        invalid_type_error: 'Peso debe ser un número positivo',
    }).min(20).max(200),
    altura: z.number({
        required_error: 'Estatura es requerida',
        invalid_type_error: 'Estatura debe ser un número',
    }).positive({
        invalid_type_error: 'Estatura debe ser un número positivo',
    }).min(1).max(2.5),
    fechaNacimiento: z.string({
        required_error: 'Fecha de nacimiento es requerida',
        invalid_type_error: 'Fecha de nacimiento debe ser un string',
    }).date('date', {
        invalid_type_error: 'Fecha de nacimiento debe ser una fecha',
        format_error: 'Fecha de nacimiento debe tener el formato YYYY-MM-DD',
    }),
    contraseña: z.string(
        {
            required_error: 'Contraseña es requerida',
            invalid_type_error: 'Contraseña debe ser un string',
            long_error: 'Contraseña debe tener menos de 20 caracteres',
        }
    ).min(8).max(20),
    tipoEntrenamiento: z.string(
        {
            required_error: 'Tipo de entrenamiento es requerido',
        }),
});

export function validacionWaby(waby) {
    return wabySchema.safeParse(waby);
}
