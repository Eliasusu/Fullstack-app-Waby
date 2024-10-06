import axios from "@/lib/axios";

import { TrainingItem } from "@/trainingItem/trainingItems.type.ts";

export const getTrainingItem = (id: string) => axios.get(`/trainings/${id}/trainingItem/${id}`);

export const createTrainingItemReq = (trainingItem: TrainingItem, idTraining: string) => axios.post(`/trainings/${idTraining}/trainingItem`, trainingItem);

export const updateTrainingItemReq = (trainingItem: TrainingItem, idTraining: string) => axios.put(`/trainings/${idTraining}/trainingItem/${trainingItem.idTrainingItem}`, trainingItem);

export const deleteTrainingItemReq = (id: string, idTraining: string) => axios.delete(`/trainings/${idTraining}/trainingItem/${id}`);