import axios from "@/api/axios.ts";

export const getTrainingOfTheDay = (date: Date) => axios.get(`/trainings/user/${date}`);

export const getAllTrainings = () => axios.get("/trainings/user");
