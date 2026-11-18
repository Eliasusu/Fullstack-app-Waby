/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { useResetOnUserChange } from "@/users/auth.context.tsx";
import type {
    CreateTrainingInput,
    CreateTrainingItemInput,
    Training,
    TrainingWithItems,
    UpdateTrainingInput,
    UpdateTrainingItemInput,
} from "@waby/shared";
import { createTrainingReq, deleteTrainingReq, getTrainingReq, getTrainingsReq, updateTrainingReq } from "@/trainings/training.api.ts";
import { createTrainingItemReq, deleteTrainingItemReq, updateTrainingItemReq } from "@/trainingItem/trainingItem.api.ts";
import { toDateOnly } from "@/lib/dates.ts";
import { attempt, type Result } from "@/lib/result.ts";
import { useLoader } from "@/lib/load.ts";

interface TrainingState {
    /** Listado (sin ítems), para la actividad y el calendario. */
    trainings: Training[];
    /** Entrenamiento del día seleccionado, con sus ítems. */
    training: TrainingWithItems | undefined;
    /** true mientras se carga el listado. */
    loadingTrainings: boolean;
    /** true mientras se carga el entrenamiento de un día. */
    loadingDay: boolean;
    getTrainings: () => Promise<void>;
    /**
     * Carga el entrenamiento del día. La API admite varios por día (nota 28); esta pantalla
     * todavía muestra el primero (nota 64).
     */
    getTrainingToDay: (date: Date) => Promise<void>;
    addTraining: (data: CreateTrainingInput) => Promise<Result<TrainingWithItems>>;
    updateTraining: (id: number, data: UpdateTrainingInput) => Promise<Result>;
    deleteTraining: (id: number) => Promise<Result>;
    addTrainingItem: (trainingId: number, data: CreateTrainingItemInput) => Promise<Result>;
    updateTrainingItem: (trainingId: number, itemId: number, data: UpdateTrainingItemInput) => Promise<Result>;
    deleteTrainingItem: (trainingId: number, itemId: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['TrainingProvider no está montado'] });

export const TrainingContext = createContext<TrainingState>({
    trainings: [],
    training: undefined,
    loadingTrainings: false,
    loadingDay: false,
    getTrainings: async () => { },
    getTrainingToDay: async () => { },
    addTraining: notReady,
    updateTraining: notReady,
    deleteTraining: notReady,
    addTrainingItem: notReady,
    updateTrainingItem: notReady,
    deleteTrainingItem: notReady,
});

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [training, setTraining] = useState<TrainingWithItems>();
    useResetOnUserChange(() => {
        setTrainings([]);
        setTraining(undefined);
    });

    const listLoader = useLoader();
    const dayLoader = useLoader();
    /** Número del último pedido de día: las respuestas de pedidos anteriores se descartan (nota 62). */
    const dayRequest = useRef(0);

    const fetchTrainings = async () => {
        const res = await getTrainingsReq();
        setTrainings(res.data);
    };

    /** Para las pantallas: si la carga falla avisa con un toast (nota 63). */
    const getTrainings = async () => {
        await listLoader.run(fetchTrainings);
    };

    const getTrainingToDay = async (date: Date) => {
        const request = ++dayRequest.current;
        const isLatest = () => request === dayRequest.current;
        // Mientras carga no se muestra el entrenamiento de otro día; si falla, queda vacío (nota 62).
        setTraining(undefined);
        await dayLoader.run(async () => {
            const day = toDateOnly(date);
            const res = await getTrainingsReq({ from: day, to: day });
            const first = res.data[0];
            const detail = first ? (await getTrainingReq(first.id)).data : undefined;
            if (isLatest()) setTraining(detail);
        });
    };

    /** Después de cada cambio se recargan el listado y el entrenamiento abierto (notas 63 y 68). */
    const refresh = async (trainingId?: number) => {
        const request = dayRequest.current;
        await fetchTrainings();
        if (trainingId !== undefined) {
            const res = await getTrainingReq(trainingId);
            // Si mientras tanto se eligió otro día, no se vuelve a mostrar este (nota 62).
            if (request === dayRequest.current) setTraining(res.data);
        }
    };

    const addTraining = (data: CreateTrainingInput) =>
        attempt(async () => {
            const res = await createTrainingReq(data);
            await fetchTrainings();
            return res.data;
        });

    const updateTraining = (id: number, data: UpdateTrainingInput) =>
        attempt(async () => {
            await updateTrainingReq(id, data);
            await refresh(training?.id === id ? id : undefined);
        });

    const deleteTraining = (id: number) =>
        attempt(async () => {
            await deleteTrainingReq(id);
            if (training?.id === id) setTraining(undefined);
            await fetchTrainings();
        });

    const addTrainingItem = (trainingId: number, data: CreateTrainingItemInput) =>
        attempt(async () => {
            await createTrainingItemReq(trainingId, data);
            await refresh(trainingId);
        });

    const updateTrainingItem = (trainingId: number, itemId: number, data: UpdateTrainingItemInput) =>
        attempt(async () => {
            await updateTrainingItemReq(trainingId, itemId, data);
            await refresh(trainingId);
        });

    const deleteTrainingItem = (trainingId: number, itemId: number) =>
        attempt(async () => {
            await deleteTrainingItemReq(trainingId, itemId);
            await refresh(trainingId);
        });

    return (
        <TrainingContext.Provider value={{ trainings, training, loadingTrainings: listLoader.loading, loadingDay: dayLoader.loading, getTrainings, getTrainingToDay, addTraining, updateTraining, deleteTraining, addTrainingItem, updateTrainingItem, deleteTrainingItem }}>
            {children}
        </TrainingContext.Provider>
    );
};
