import { z } from 'zod';
import { Training } from './training.entity.js';

export const trainingsSchema: any = z.object({
  mesocycle: z.number({}).positive({}),
  trainingName: z.string({
    required_error: 'Training name is required',
    invalid_type_error: 'Training name must be a string',
  }),
  trainingType: z.string({
    required_error: 'Training type is required',
    invalid_type_error: 'Training type must be a string',
  }),
  day: z.string({
    required_error: 'Day is required',
    invalid_type_error: 'Day must be a string',
  }),
  time: z.string({
    required_error: 'Time is required',
    invalid_type_error: 'Time must be a string',
  }),
  completed: z.boolean({
    required_error: 'Completed is required',
    invalid_type_error: 'Completed must be a boolean'
  }),
  exercisesTrainings: z.array(z.number({})),
});


export function validateTraining(training: Training) {
  return trainingsSchema.safeParse(training);
}

export function validateParcialTraining(training: Training) {
  return trainingsSchema.partial().safeParse(training);
}
