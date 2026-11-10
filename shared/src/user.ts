import { z } from 'zod';
import { DateOnlySchema, IdSchema, RefSchema, todayDateOnly } from './common.js';
import { RoleSchema } from './enums.js';

/** Usuario tal como lo devuelve la API. Nunca incluye la contraseña. */
export const UserSchema = z.object({
    id: z.number().int(),
    username: z.string(),
    email: z.string(),
    name: z.string(),
    birthdate: DateOnlySchema,
    phone: z.string().nullable(),
    bodyWeightKg: z.number(),
    heightCm: z.number(),
    role: RoleSchema,
    trainingMethods: z.array(RefSchema),
});
export type User = z.infer<typeof UserSchema>;

/** bcrypt solo usa los primeros 72 bytes de la contraseña. */
const PasswordSchema = z.string().min(8, 'La contraseña tiene que tener al menos 8 caracteres').max(72);

const UserFieldsSchema = z.object({
    username: z.string().trim().min(3).max(30),
    email: z.string().trim().email('El email no es válido').max(255),
    password: PasswordSchema,
    name: z.string().trim().min(1).max(100),
    birthdate: DateOnlySchema.refine((date) => date <= todayDateOnly(), 'La fecha de nacimiento no puede ser futura'),
    phone: z.string().trim().max(30).optional(),
    bodyWeightKg: z.number().positive().max(500),
    heightCm: z.number().positive().max(300),
    trainingMethodIds: z.array(IdSchema).min(1, 'Elegí al menos un método de entrenamiento'),
});

/** Registro. El rol no se puede mandar: todo usuario nuevo es `USER`. */
export const RegisterSchema = UserFieldsSchema.strict();
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const UpdateUserSchema = UserFieldsSchema.partial().strict();
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const LoginSchema = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;
