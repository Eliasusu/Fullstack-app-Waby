import { z } from 'zod';
import { mesocyclesSchema } from '../mesocycles/mesocycles.schema.js';
import { userSchema } from '../users/users.schema.js';
import { exercisesSchema } from '../exercises/exercises.schema.js';
import { exercise_Training } from '../exercises_trainings/exercises_trainings.schema.js';

export const trainingsSchema:any = z.object({
  user: userSchema,
  mesocycle: mesocyclesSchema,
  trainingName: z.string({
    required_error: 'Training name is required',
    invalid_type_error: 'Training name must be a string',
  }),
  trainingType: z.string({
    required_error: 'Training type is required',
    invalid_type_error: 'Training type must be a string',
  }),
  day: z.date({
    required_error: 'Day is required',
    invalid_type_error: 'Day must be a date',
  }),
  time: z.string({
    required_error: 'Time is required',
    invalid_type_error: 'Time must be a string',
  }),
  exercises: exercisesSchema.array(),
  exercise_Training: exercise_Training.optional(),
});

type Training = z.infer<typeof trainingsSchema>;

export function validateTraining(training: Training) {
  return trainingsSchema.safeParse(training);
}

export function validateParcialTraining(training: Training) {
  return trainingsSchema.partial().safeParse(training);
}
