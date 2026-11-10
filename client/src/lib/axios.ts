import axios from "axios";

/** URL de la API. Se configura con VITE_API_URL (client/.env); por defecto, la API local. */
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1/',
    withCredentials: true,
})

export default instance
