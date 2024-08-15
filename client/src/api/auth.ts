import axios from 'axios';

export const registerRequest = (user: object)=> axios.post('http://localhost:3000/api/v1/auth/register', user)