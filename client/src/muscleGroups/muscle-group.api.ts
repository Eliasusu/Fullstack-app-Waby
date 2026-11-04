import axios from '@/lib/axios.ts';
import type { MuscleGroup } from '@waby/shared';

export const getAllMuscleGroups = () => axios.get<MuscleGroup[]>('/muscle-groups')

export const getMuscleGroup = (id: number) => axios.get<MuscleGroup>(`/muscle-groups/${id}`)
