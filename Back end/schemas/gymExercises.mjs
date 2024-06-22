import { date, z } from 'zod';
import { TrainingMethod } from '../models/trainingMethod.ts'; 
import { MuscleGroup } from '../models/muscleGroup.ts';
import { Training } from '../models/training.ts';

const gymExercisesSchema = z.object({
  training: z.object({
    required_error: 'Training is required',
    invalid_type_error: 'Training must be an object',
  }),
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
  videoUrl: z.string({
    required_error: 'Video URL is required',
    invalid_type_error: 'Video URL must be a string',
    format_error: 'Video URL must have the format to be a URL',
  }),
  image: z.string({
    required_error: 'Image is required',
    invalid_type_error: 'Image must be a string',
    format_error: 'Image must have the format to be a URL',
  }),
  muscleGroup: z.array (z.object({
    required_error: 'MuscleGroup is required',
    invalid_type_error: 'MuscleGroup must be an objectt',
  })),
  difficulty: z.difficulty({
    required_error: 'Difficulty is required',
    invalid_type_error: 'Difficulty must be a string',
    format_error: 'Difficulty must be one of the following: "Beginner", "Intermediate", "Advanced"',
  }),
  typeExcercise:z.string({
    required_error: 'Type of excercise is required',
    invalid_type_error: 'Type of excercise must be a string',
    format_error: 'Type of excercise must be one of the following: "Cardio", "Strength"',
  }),
  date: z.string({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a string',
  }).date('date', {
    invalid_type_error: 'Date must be a date',
    format_error: 'Date must have the format YYYY-MM-DD',
  }),
});

export function validateGymExercises(gymExercises) {
  return gymExercisesSchema.safeParse(gymExercises);
}

export function validateParcialGymExercises(gymExercises){
  return gymExercisesSchema.partial().safeParse(gymExercises);
}