import axios from '@/lib/axios.ts';
import type { LoginInput, RegisterInput, UpdateUserInput, User } from '@waby/shared';

export const registerRequest = (data: RegisterInput) => axios.post<User>('auth/register', data)

export const loginRequest = (data: LoginInput) => axios.post<User>('auth/login', data)

export const logoutRequest = () => axios.post('auth/logout')

/** Usuario de la sesión. 401 si no hay sesión: así se verifica al recargar. */
export const getMeRequest = () => axios.get<User>('users/me')

export const updateMeRequest = (data: UpdateUserInput) => axios.patch<User>('users/me', data)

export const deleteMeRequest = () => axios.delete('users/me')
