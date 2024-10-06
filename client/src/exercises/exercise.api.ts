import axios from '@/lib/axios';
import { Exercise } from './exercise.type';

export const createExercise = (exercise: object) => axios.post('/exercises', exercise)

export const getExercisesReq = () => axios.get('/exercises')

export const getExercisesByMg = (mg: string) => axios.get(`/exercises/muscleGroup/${mg}`)

export const deleteExercise = (id: number) => axios.delete(`/exercises/${id}`)

export const updateExercise = (exercise: Exercise) => axios.put(`/exercises/${exercise.idExercise}`, exercise)