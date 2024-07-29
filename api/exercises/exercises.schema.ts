import { z } from 'zod'; 
import { muscleGroupSchema } from '../muscleGroups/muscleGroups.schema.js';
import { trainingMethodSchema } from '../trainingMethods/trainingMethod.schema.js';
import { trainingsSchema } from '../trainings/trainings.schema.js';

export const exercisesSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  trainingMethod: trainingMethodSchema,
  description: z.string({}).optional(),
  muscleGroups: z.array(muscleGroupSchema),
  difficulty: z.string({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
  }),
  typeExercise: z.string({
    invalid_type_error: 'Type of exercise must be a string',
  }),
  idExercise: z.number().positive().optional(),
  training: z.string().optional(),
  image: z.string({
    invalid_type_error: 'Image must be a string',
  }).optional(),
  dateCreated: z.date({
    invalid_type_error: 'Date must be a date',
  }),
});

type Exercise = z.infer<typeof exercisesSchema>;

export function validateExercises(exercises: Exercise) {
  return exercisesSchema.safeParse(exercises)
}
export function validateParcialExercises(exercises: Exercise){
  return exercisesSchema.partial().safeParse(exercises);
}
