import axios from "@/lib/axios";

export const getTrainingOfTheDay = (date: string) => axios.get(`/trainings/${date}/user`);

export const getAllTrainings = () => axios.get("/trainings/user");
