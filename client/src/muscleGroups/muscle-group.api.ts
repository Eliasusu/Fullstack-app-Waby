import axios from '@/lib/axios.ts';

export const getAllMuscleGroups = () => axios.get('/muscleGroups')

export const getMuscleGroup = (id: number) => axios.get(`/muscleGroups/${id}`)