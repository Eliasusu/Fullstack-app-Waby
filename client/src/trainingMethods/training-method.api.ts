import axios from '@/lib/axios';

export const getOneTrainingMethod = (id: string) => axios.get(`/trainingMethods/${id}`)

export const getTrainingMethods = () => axios.get('/trainingMethods')