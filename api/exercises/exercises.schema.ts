import { z } from 'zod'; 
import { Exercise } from './exercise.entity.js';

export const exercisesSchema:any = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  trainingMethod: z.string({}), 
  description: z.string({}).optional(),
  muscleGroups: z.array(z.number()),
  difficulty: z.string({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
  }),
  typeExercise: z.string({
    invalid_type_error: 'Type of exercise must be a string',
  }),
  dateCreated: z.date().optional(),
  image: z.string({
    invalid_type_error: 'Image must be a string',
  }).optional(),
  exercise_Training: z.string({}).optional(),
  calisthenicsProgressionPerReps: z.array(z.number()).optional(),
  calisthenicsProgressionPerSec: z.array(z.number()).optional(),
});


export function validateExercises(exercises: Exercise) {
  return exercisesSchema.safeParse(exercises)
}
export function validateParcialExercises(exercises: Exercise){
  return exercisesSchema.partial().safeParse(exercises);
}
