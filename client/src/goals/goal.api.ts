import axios from '@/lib/axios';
import type { CreateGoalInput, Goal, UpdateGoalInput } from '@waby/shared';

export const getGoalsReq = () => axios.get<Goal[]>('/goals')

export const createGoalReq = (data: CreateGoalInput) => axios.post<Goal>('/goals', data)

export const updateGoalReq = (id: number, data: UpdateGoalInput) => axios.patch<Goal>(`/goals/${id}`, data)

export const deleteGoalReq = (id: number) => axios.delete(`/goals/${id}`)
