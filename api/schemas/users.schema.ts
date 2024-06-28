import { z } from 'zod';

export const userSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
    }),

    password: z.string({
        required_error: 'Password is required', 
    }).min(8).max(16),

    email: z.string({
        required_error: 'Mail is required',
        invalid_type_error: 'Mail must be a string',
    }),
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }).max(20),

    birthday: z.string({
        required_error: 'Birthday is required',
        invalid_type_error: 'Birthday must be a string',
    }),
    phone: z.string({}),
    bodyWeight: z.number({
        required_error: 'Weight is required',
        invalid_type_error: 'Weight must be a number',
        }).int({}).positive({}).min(20).max(150),

    height: z.number({
        required_error: 'Height is required',
        invalid_type_error: 'Height must be a number',
        }).positive({}).min(1).max(2.5),

    trainingMethod: z.string({
        required_error: 'Training type is required',
        invalid_type_error: 'Training type must be a string',
    })
});

export function validateUser(user) {
    return userSchema.safeParse(user);
}

export function validateParcialUser(user){
    return userSchema.partial().safeParse(user);
}

