import { z } from 'zod';
import { User } from '../models/user.ts';
import { Mesocycle } from '../models/mesocycle.ts';

const trainingSchema = z.object({
  user: z.object({
    required_error: 'User is required',
    invalid_type_error: 'User must be an object',
  }),
  mesocycle: z.object({
    required_error: 'Mesocycle is required',
    invalid_type_error: 'Mesocycle must be an object',
  }),
  date: z.string({
    required_error: 'Date is required',
    invalid_type_error: 'Date must be a string',
  }).date('date', {
    invalid_type_error: 'Date must be a date',
    format_error: 'Date must have the format YYYY-MM-DD',
  }),
  trainingType: z.string({
    required_error: 'Training type is required',
    invalid_type_error: 'Training type must be a string',
    format_error: 'Training type must be one of the following: "Calisthenics", "Gym"',
  }),
  day: z.string({
    required_error: 'Day is required',
    invalid_type_error: 'Day must be a string',
  }).date('date', {
    invalid_type_error: 'Day must be a date',
    format_error: 'Day must have the format YYYY-MM-DD',
  }),
});

export function validateTraining(training) {
  return trainingSchema.safeParse(training);
}

export function validateParcialTraining(training) {
  return trainingSchema.partial().safeParse(training);
}