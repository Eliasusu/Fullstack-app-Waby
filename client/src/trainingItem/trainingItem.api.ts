import axios from "@/lib/axios";

import { TrainingItemProps } from "@/trainingItem/trainingItems.type.ts";



export const getTrainingItem = (id: string) => axios.get(`/trainings/${id}/trainingItem/${id}`);

export const createTrainingItemReq = (trainingItem: TrainingItemProps, idTraining: string) => axios.post(`/trainings/${idTraining}/trainingItem`, trainingItem);

export const updateTrainingItemReq = (trainingItem: TrainingItemProps, idTraining: string, idTItem: string ) => axios.put(`/trainings/${idTraining}/trainingItem/${idTItem}`, trainingItem);

export const deleteTrainingItemReq = (id: string, idTraining: string) => axios.delete(`/trainings/${idTraining}/trainingItem/${id}`);