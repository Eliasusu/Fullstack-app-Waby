import { z } from 'zod'; 
import { muscleGroupSchema } from './muscleGroups.schema.js';

const exerciseSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  trainingMethod: z.string({
    required_error: 'TrainingMethod is required',
    invalid_type_error: 'TrainingMethod must be a string',
  }),
  description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
  }),

  muscleGroups: z.array(muscleGroupSchema),

  difficulty: z.string({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
  }),
  typeExercise: z.string({
    invalid_type_error: 'Type of exercise must be a string',
  }),
});

export function validateExercises(exercises) {
  return exerciseSchema.safeParse(exercises)
}
export function validateParcialExercises(exercises){
  return exerciseSchema.partial().safeParse(exercises);
}
