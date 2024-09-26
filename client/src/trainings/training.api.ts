import axios from "@/lib/axios";
import { Training } from "./trainings.type.ts";

export const getTrainingOfTheDay = (date: string) => axios.get(`/trainings/${date}/user`);

export const getAllTrainings = () => axios.get("/trainings/user");

export const createTraining = (training: Training) => axios.post("/trainings", training);

export const deleteTrainingReq = (id: number) => axios.delete(`/trainings/${id}`);