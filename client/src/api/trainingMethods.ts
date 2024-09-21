import axios from './axios.ts';

export const getOneTrainingMethod = (id: string) => axios.get(`/trainingMethods/${id}`)

export const getTrainingMethods = () => axios.get('/trainingMethods')