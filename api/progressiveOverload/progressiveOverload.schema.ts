import { z } from "zod";
import { ProgressiveOverload } from "./progressiveOverload.entity.js";

export const progressiveOverloadSchema: any = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }).length(50).min(3),
    logDate: z.date().optional(),
    weightLifted: z.string({
        required_error: 'Weight lifted is required',
        invalid_type_error: 'Weight lifted must be a string',
    }).length(3).min(1).optional(),
    repsDone: z.string({
        required_error: 'Reps done is required',
        invalid_type_error: 'Reps done must be a string',
    }).length(1).optional(),
    repsGoal: z.string({
        required_error: 'Reps goal is required',
        invalid_type_error: 'Reps goal must be a string',
    }).min(1).optional(),
    exercise: z.string({
        required_error: 'Exercise is required',
        invalid_type_error: 'Exercise must be a string',
    })
});

export function validateProgressiveOverload(progressiveOverload: ProgressiveOverload) {
    return progressiveOverloadSchema.safeParse(progressiveOverload);
}

export function validateParcialProgressiveOverload(progressiveOverload: ProgressiveOverload) {
    return progressiveOverloadSchema.partial().safeParse(progressiveOverload);  
}