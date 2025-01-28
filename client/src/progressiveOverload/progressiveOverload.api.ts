import axios from '@/lib/axios';
import { ProgressiveOverload } from './progressiveOverload.type';

export const createProgressiveOverload = (progressiveOverload: object) => axios.post('/progressiveOverload', progressiveOverload)

export const getProgressiveOverloadsReq = () => axios.get('/progressiveOverload')

export const getProgressiveOverload = (id: number) => axios.get(`/progressiveOverload/${id}`)

export const deleteProgressiveOverload = (id: number) => axios.delete(`/progressiveOverload/${id}`)

export const updateProgressiveOverload = (progressiveOverload: ProgressiveOverload) => axios.put(`/progressiveOverload/${progressiveOverload.idProgressiveOverload}`, progressiveOverload)

export const getProgressiveOverloadsByExercise = (id: number) => axios.get(`/progressiveOverload/exercise/${id}`)
