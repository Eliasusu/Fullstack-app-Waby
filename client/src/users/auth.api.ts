import axios from '@/lib/axios.ts';


export const registerRequest = (user: object) => axios.post('auth/register', user)

export const loginRequest = (user: object) => axios.post('auth/login', user)

export const verifyTokenRequest = () => axios.get('auth/verify') 

export const updateProfileRequest = (id: string, user: object) => axios.put(`users/${id}`, user)

export const deleteProfileRequest = (id: string) => axios.delete(`users/${id}`)

export const getProfileRequest = (id: string) => axios.get(`users/${id}`)