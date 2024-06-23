<<<<<<< HEAD:src/schemas/trainings.mjs
=======
import { z } from 'zod';
import { mesocycleSchema } from './mesocycles.schema.mjs';
import { userSchema } from './users.schema.mjs';

const trainingSchema = z.object({
  user: z.userSchema({
    required_error: 'User is required',
  }),
  mesocycle: z.mesocycleSchema({
    required_error: 'Mesocycle is required',
  }),
  trainingType: z.string({
    invalid_type_error: 'Training type must be a string',
  }),
  trainingName: z.string({
    invalid_type_error: 'Training name must be a string',
  }),
  day: z.string({
    required_error: 'Day is required',
    invalid_type_error: 'Day must be a string',
  }).date('date', {
    invalid_type_error: 'Day must be a date',
    format_error: 'Day must have the format YYYY-MM-DD',
  }),
  time: z.string({
    required_error: 'Time is required',
    invalid_type_error: 'Time must be a string',
  }).date('time', {
    invalid_type_error: 'Time must be a time',
    format_error: 'Time must have the format HH:mm',
  }),
});

export function validateTraining(training) {
  return trainingSchema.safeParse(training);
}

export function validateParcialTraining(training) {
  return trainingSchema.partial().safeParse(training);
}
>>>>>>> origin/feature/usuario:src/schemas/trainings.schema.mjs
