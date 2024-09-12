import axios from './axios.ts';

export const createExercise = (exercise: object) => axios.post('/exercises', exercise)

export const getExercisesReq = () => axios.get('/exercises')