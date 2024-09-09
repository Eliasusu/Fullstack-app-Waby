import axios from 'axios';

export const createExercise = (exercise: object) => axios.post('http://localhost:3000/api/v1/exercises', exercise)

export const getExercises = () => axios.get('http://localhost:3000/api/v1/exercises')