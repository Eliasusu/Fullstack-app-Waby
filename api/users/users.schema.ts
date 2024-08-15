import { z } from 'zod';
import { User } from './user.entity.js';

export const userSchema:any = z.object({
    
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
    }).min(6).max(40),

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

    birthdate: z.date({
        required_error: 'Birthdate is required',
        invalid_type_error: 'Birthdate must be a date',
    }),

    phone: z.string({}).optional(),
    bodyWeight: z.number({
        required_error: 'Weight is required',
        invalid_type_error: 'Weight must be a number',
        }).int({}).positive({}).min(20).max(150),

    height: z.number({
        required_error: 'Height is required',
        invalid_type_error: 'Height must be a number',
    }).positive({}).min(1).max(250),
    trainingMethods: z.array(z.string({})),
});

export function validateUser(user: User) {
    const birthdate = new Date(user.birthdate);
    return userSchema.safeParse(user = {...user, birthdate});
}

export function validateParcialUser(user: User){
    if(user.birthdate) user.birthdate = new Date(user.birthdate);
    return userSchema.partial().safeParse(user);
}

