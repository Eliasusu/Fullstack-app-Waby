import axios from './axios.ts';


export const registerRequest = (user: object) => axios.post('auth/register', user)

export const loginRequest = (user: object) => axios.post('auth/login', user)

export const verifyTokenRequest = () => axios.get('auth/verify') 