import { z } from 'zod';
// import { mesocycleSchema } from './mesocycles.schema.mjs';
// import { userSchema } from './users.schema.mjs';

const trainingSchema = z.object({
  
});

export function validateTraining(training) {
  return trainingSchema.safeParse(training);
}

export function validateParcialTraining(training) {
  return trainingSchema.partial().safeParse(training);
}
