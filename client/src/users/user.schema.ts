import { z } from 'zod';

export const UserSchema = z.object({
  idUser: z.string().optional(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  birthdate: z.date(),
  phone: z.string(),
  bodyWeight: z.number(),
  height: z.number(),
  trainingMethods: z.array(z.string()).optional()
});