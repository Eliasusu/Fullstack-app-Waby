import axios from '@/lib/axios.ts';
import type { CreateMuscleGroupInput, MuscleGroup, UpdateMuscleGroupInput } from '@waby/shared';

export const getAllMuscleGroups = () => axios.get<MuscleGroup[]>('/muscle-groups')

export const getMuscleGroup = (id: number) => axios.get<MuscleGroup>(`/muscle-groups/${id}`)

// Alta, edición y baja: solo admin (la API responde 403 a un usuario común). Nota 77.
export const createMuscleGroup = (data: CreateMuscleGroupInput) => axios.post<MuscleGroup>('/muscle-groups', data)

export const updateMuscleGroup = (id: number, data: UpdateMuscleGroupInput) => axios.patch<MuscleGroup>(`/muscle-groups/${id}`, data)

export const deleteMuscleGroup = (id: number) => axios.delete(`/muscle-groups/${id}`)
