import { z } from 'zod';

export const userSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
        long_error: 'Username must have less than 20 characters',
    }),

    password: z.string({
        password: 'Password is required',
    }),

    email: z.string({
        required_error: 'Mail is required',
        invalid_type_error: 'Mail must be a string',
        long_error: 'Mail must have less than 30 characters',
        format_error: 'Mail must have the format to be an email',
    }),

    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
        long_error: 'Password must have less than 16 characters',
    }).min(8).max(16),
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
        long_error: 'Name must have less than 20 characters',
    }),

    birthday: z.string({
        required_error: 'Date of birth is required',
        invalid_type_error: 'Date of birth must be a string',
    }).date('date', {
        invalid_type_error: 'Date of birth must be a date',
        format_error: 'Date of birth must have the format YYYY-MM-DD',
    }),
    phone: z.string({
        long_error: 'Phone must have less than 15 characters',
    }),
    bodyWeight: z.number({
        required_error: 'Weight is required',
        invalid_type_error: 'Weight must be a number',
    }).int({
        invalid_type_error: 'Weight must be an integer',
    }).positive({
        invalid_type_error: 'Weight must be a positive number',
    }).min(20).max(150),

    height: z.number({
        required_error: 'Height is required',
        invalid_type_error: 'Height must be a number',
    }).positive({
        invalid_type_error: 'Height must be a positive number',
    }).min(1).max(2.5),

    trainingMethod: z.string({
        required_error: 'Training type is required',
        invalid_type_error: 'Training type must be a string',
        format_error: 'Training type must be one of the following: "Calisthenics", "Gym"',
    })
});

export function validateUser(user) {
    return userSchema.safeParse(user);
}

export function validateParcialUser(user){
    return userSchema.partial().safeParse(user);
}

