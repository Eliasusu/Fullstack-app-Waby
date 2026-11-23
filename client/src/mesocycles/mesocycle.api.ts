import axios from "@/lib/axios";
import type { CreateMesocycleInput, Mesocycle, Training, UpdateMesocycleInput } from "@waby/shared";

/** Mesociclos del usuario de la sesión (nota 78). La API filtra por usuario: los de otro responden 404. */
export const getMesocyclesReq = () => axios.get<Mesocycle[]>("/mesocycles");

export const getMesocycleReq = (id: number) => axios.get<Mesocycle>(`/mesocycles/${id}`);

/** Entrenamientos del Mesociclo, ordenados por día (nota 79). */
export const getMesocycleTrainingsReq = (id: number) => axios.get<Training[]>(`/mesocycles/${id}/trainings`);

export const createMesocycleReq = (data: CreateMesocycleInput) => axios.post<Mesocycle>("/mesocycles", data);

export const updateMesocycleReq = (id: number, data: UpdateMesocycleInput) => axios.patch<Mesocycle>(`/mesocycles/${id}`, data);

/** Sus Entrenamientos no se borran: quedan sueltos (`mesocycle: null`). */
export const deleteMesocycleReq = (id: number) => axios.delete(`/mesocycles/${id}`);
