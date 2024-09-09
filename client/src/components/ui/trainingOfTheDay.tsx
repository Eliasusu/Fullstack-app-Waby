import { getTrainingOfTheDay } from "@/api/training.ts";
import { useState, useEffect } from "react";
import { Training } from "@/types/trainings.type.ts";

export default function TrainingOfTheDay() {
    const [training, setTraining] = useState<Training[]>([]);
    const [errors, setErrors] = useState<string | null>(null);

    useEffect(() => {
        trainingOfTheDay();
    }, []);

    const trainingOfTheDay = async () => {
        try {
            const response = await getTrainingOfTheDay();
            setTraining(response.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors(error.message);
                console.log(error.message);
            } else {
                setErrors("Hubo un problema al cargar el entrenamiento");
                console.log("Hubo un problema al cargar el entrenamiento");
            }
        }
    };

    return (
        <div>
            {errors && <p>{errors}</p>}
            {training.length > 0 ? (
                <ul>
                    {training.map((t) => (
                        <li key={t.idTraining}>
                            <p>Nombre: {t.trainingName}</p>
                            <p>Tipo: {t.trainingType}</p>
                            <p>Día: {t.day}</p>
                            <p>Hora: {t.time}</p>
                            <p>Completado: {t.completed ? "Sí" : "No"}</p>
                            <p>Ejercicios: {t.exercisesTrainings.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay entrenamiento para hoy</p>
            )}
        </div>
    );
}
