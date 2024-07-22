import { z } from 'zod';
import { mesocyclesSchema } from './mesocycles.schema.js';
import { userSchema } from './users.schema.js';

export const trainingsSchema = z.object({
  idTraining: z.string({}).min(1).max(1).optional(),
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
});

type Training = z.infer<typeof trainingsSchema>;

export function validateTraining(training: Training) {
  training.day = new Date(training.day);
  training.user.birthdate = new Date(training.user.birthdate);
  training.mesocycle.startDate = new Date(training.mesocycle.startDate);
  training.mesocycle.endDate = new Date(training.mesocycle.endDate);
  return trainingsSchema.safeParse(training);
}

export function validateParcialTraining(training: Training) {
  if (training.day) training.day = new Date(training.day)
  return trainingsSchema.partial().safeParse(training);
}
