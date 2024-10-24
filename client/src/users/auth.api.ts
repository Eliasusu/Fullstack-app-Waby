import axios from '@/lib/axios.ts';
import { User } from './user.type.ts';


export const registerRequest = (user: object) => axios.post('auth/register', user)

export const loginRequest = (user: object) => axios.post('auth/login', user)

export const verifyTokenRequest = () => axios.get('auth/verify') 

export const updateProfileRequest = (user: User) => axios.put(`users/${user.idUser}`, user)

export const deleteProfileRequest = (id: string) => axios.delete(`users/${id}`)