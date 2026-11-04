import axios from "@/lib/axios";
import type { CreateTrainingInput, Training, TrainingWithItems, UpdateTrainingInput } from "@waby/shared";

/** Entrenamientos entre dos fechas `YYYY-MM-DD` (inclusive). Sin rango, todos. */
export const getTrainingsReq = (range: { from?: string; to?: string } = {}) => axios.get<Training[]>("/trainings", { params: range });

export const getTrainingReq = (id: number) => axios.get<TrainingWithItems>(`/trainings/${id}`);

export const createTrainingReq = (data: CreateTrainingInput) => axios.post<TrainingWithItems>("/trainings", data);

export const updateTrainingReq = (id: number, data: UpdateTrainingInput) => axios.patch<TrainingWithItems>(`/trainings/${id}`, data);

export const deleteTrainingReq = (id: number) => axios.delete(`/trainings/${id}`);
