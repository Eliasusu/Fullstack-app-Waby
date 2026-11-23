import axios from '@/lib/axios';
import type { CreateTrainingMethodInput, TrainingMethod, UpdateTrainingMethodInput } from '@waby/shared';

/** Público: lo usa el registro antes de que haya sesión. */
export const getTrainingMethods = () => axios.get<TrainingMethod[]>('/training-methods')

// Alta, edición y baja: solo admin (la API responde 403 a un usuario común). Nota 77.
export const createTrainingMethod = (data: CreateTrainingMethodInput) => axios.post<TrainingMethod>('/training-methods', data)

export const updateTrainingMethod = (id: number, data: UpdateTrainingMethodInput) => axios.patch<TrainingMethod>(`/training-methods/${id}`, data)

export const deleteTrainingMethod = (id: number) => axios.delete(`/training-methods/${id}`)
