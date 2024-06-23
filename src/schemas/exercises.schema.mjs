import { z } from 'zod';
import { muscleGroupSchema } from './muscleGroup.schema';

const exerciseSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
    long_error: 'Name must have less than 20 characters',
  }),
  TrainingMethod: z.string({
    required_error: 'TrainingMethod is required',
    invalid_type_error: 'TrainingMethod must be a string',
    format_error: 'TrainingMethod must be one of the following: "Calisthenics", "Gym"',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
    long_error: 'Description must have less than 50 characters',
  }),
  muscleGroup: z.array (z.muscleGroupSchema({
    required_error: 'muscleGroup is required',
  })),
  difficulty: z.string({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
    format_error: 'Difficulty must be one of the following: "Beginner", "Intermediate", "Advanced"',
  }),
  typeExercise:z.string({
    required_error: 'Type of exercise is required',
    invalid_type_error: 'Type of exercise must be a string',
    format_error: 'Type of exercise must be one of the following: "Hipertrofy", "Strength"',
  }),
});

export function validateExercises(exercises) {
  return exerciseSchema.safeParse(exercises)
}
export function validateParcialExercises(exercises){
  return exerciseSchema.partial().safeParse(exercises);
}