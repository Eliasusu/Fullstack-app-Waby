import axios from "@/lib/axios";
import Training  from "@/trainings/trainings.type.ts";

export const getTrainingOfTheDay = (date: string) => axios.get(`/trainings/${date}/user`);

export const getAllTrainings = () => axios.get("/trainings/user");

export const createTraining = (training: Training) => axios.post("/trainings", training);

export const updateTrainingReq = (training: Training) => axios.put(`/trainings/${training.idTraining}`, training);
