import axios from "@/lib/axios";
import type { CreateTrainingItemInput, TrainingItem, UpdateTrainingItemInput } from "@waby/shared";

export const createTrainingItemReq = (trainingId: number, data: CreateTrainingItemInput) =>
    axios.post<TrainingItem>(`/trainings/${trainingId}/items`, data);

export const updateTrainingItemReq = (trainingId: number, itemId: number, data: UpdateTrainingItemInput) =>
    axios.patch<TrainingItem>(`/trainings/${trainingId}/items/${itemId}`, data);

export const deleteTrainingItemReq = (trainingId: number, itemId: number) =>
    axios.delete(`/trainings/${trainingId}/items/${itemId}`);
