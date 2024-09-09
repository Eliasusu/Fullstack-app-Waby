
import axios from "axios";

export const getTrainingOfTheDay = () => axios.get("http://localhost:3000/api/v1/trainings/today/user");