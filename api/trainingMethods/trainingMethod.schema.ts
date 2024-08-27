import { optional, z } from 'zod';

export const trainingMethodSchema = z.object({
    nameMethod: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
    
    description: z.string({
        invalid_type_error: 'Description must be a string',
    }),

});