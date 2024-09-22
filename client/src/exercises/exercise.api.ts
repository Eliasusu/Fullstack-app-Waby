import axios from '@/lib/axios';

export const createExercise = (exercise: object) => axios.post('/exercises', exercise)

export const getExercisesReq = () => axios.get('/exercises')

export const getExercisesByMg = (mg: string) => axios.get(`/exercises/muscleGroup/${mg}`)