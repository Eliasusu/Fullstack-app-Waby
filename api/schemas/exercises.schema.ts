import { z } from 'zod'; 
import { muscleGroupSchema } from './muscleGroups.schema.js';
import { trainingMethodSchema } from './trainingMethod.schema.js';
import { trainingsSchema } from './trainings.schema.js';
import { deserialize } from 'v8';

export const exercisesSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  trainingMethod: trainingMethodSchema,
  training: trainingsSchema,
  description: z.string({}),
  muscleGroups: z.array(muscleGroupSchema),
  difficulty: z.string({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
  }),
  typeExercise: z.string({
    invalid_type_error: 'Type of exercise must be a string',
  }),
  videoUrl: z.string({
    invalid_type_error: 'Video URL must be a string',
  }),
  image: z.string({
    invalid_type_error: 'Image must be a string',
  }),
  idExercise: z.string({
    invalid_type_error: 'Id of exercise must be a string',
  }),
  date: z.date({
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
