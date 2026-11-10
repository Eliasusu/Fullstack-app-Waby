import axios from '@/lib/axios';
import type { CreateExerciseInput, Exercise, UpdateExerciseInput } from '@waby/shared';

export const getExercisesReq = (filters: { muscleGroupId?: number; trainingMethodId?: number } = {}) =>
    axios.get<Exercise[]>('/exercises', { params: filters })

export const createExerciseReq = (data: CreateExerciseInput) => axios.post<Exercise>('/exercises', data)

export const updateExerciseReq = (id: number, data: UpdateExerciseInput) => axios.patch<Exercise>(`/exercises/${id}`, data)

export const deleteExerciseReq = (id: number) => axios.delete(`/exercises/${id}`)
