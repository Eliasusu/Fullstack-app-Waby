import axios from '@/lib/axios';
import type { TrainingMethod } from '@waby/shared';

/** Público: lo usa el registro antes de que haya sesión. */
export const getTrainingMethods = () => axios.get<TrainingMethod[]>('/training-methods')
