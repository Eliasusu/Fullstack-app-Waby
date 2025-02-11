import { z } from "zod";
import { ProgressiveOverload } from "./progressiveOverload.entity.js";
import { Exercise } from "../exercises/exercise.entity.js";

export const progressiveOverloadSchema: any = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }).min(3).max(50),
    logDate: z.string().optional(),
    typePO: z.string({
        required_error: 'TypePO is required',
        invalid_type_error: 'TypePO must be a string',
    }),
    done: z.number({
        required_error: 'Done is required',
        invalid_type_error: 'Done must be a number',
    }).positive(),
    goal: z.number({
        required_error: 'Goal is required',
        invalid_type_error: 'Goal must be a number',
    }).positive().min(1),
    exercise: z.object({}),
});

export function validateProgressiveOverload(progressiveOverload: ProgressiveOverload) {
    return progressiveOverloadSchema.safeParse(progressiveOverload);
}

export function validateParcialProgressiveOverload(progressiveOverload: ProgressiveOverload) {
    return progressiveOverloadSchema.partial().safeParse(progressiveOverload);  
}