import axios from '@/lib/axios';
import { Exercise } from '@/exercises/exercise.type.ts';

export const createExercise = (exercise: Exercise) => axios.post('/exercises', exercise)

export const updateExercise = (exercise: Exercise) => axios.put(`/exercises/${exercise.idExercise}`, exercise)

export const getExercisesReq = () => axios.get('/exercises')

export const getExercisesByMg = (mg: string) => axios.get(`/exercises/muscleGroup/${mg}`)
