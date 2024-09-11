import axios from './axios.ts';


export const registerRequest = (user: object) => axios.post('/api/v1/auth/register', user)

export const loginRequest = (user: object) => axios.post('/api/v1/auth/login', user)

export const verifyTokenRequest = () => axios.get('/api/v1/auth/verify') 