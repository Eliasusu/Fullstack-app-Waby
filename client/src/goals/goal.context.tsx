/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import { useResetOnUserChange } from "@/users/auth.context.tsx";
import type { CreateGoalInput, Goal, UpdateGoalInput } from "@waby/shared";
import { createGoalReq, deleteGoalReq, getGoalsReq, updateGoalReq } from "@/goals/goal.api.ts";
import { attempt, type Result } from "@/lib/result.ts";
import { useLoader } from "@/lib/load.ts";

interface GoalState {
    goals: Goal[];
    /** true mientras se cargan las Metas. */
    loading: boolean;
    getAll: () => Promise<void>;
    create: (data: CreateGoalInput) => Promise<Result>;
    update: (id: number, data: UpdateGoalInput) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['GoalProvider no está montado'] });

export const GoalContext = createContext<GoalState>({
    goals: [],
    loading: false,
    getAll: async () => { },
    create: notReady,
    update: notReady,
    remove: notReady,
});

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    useResetOnUserChange(() => setGoals([]));

    const { loading, run } = useLoader();

    const fetchGoals = async () => {
        const res = await getGoalsReq();
        setGoals(res.data);
    };

    /** Para las pantallas: si la carga falla avisa con un toast (nota 63). */
    const getAll = async () => {
        await run(fetchGoals);
    };

    const create = (data: CreateGoalInput) =>
        attempt(async () => {
            await createGoalReq(data);
            await fetchGoals();
        });

    const update = (id: number, data: UpdateGoalInput) =>
        attempt(async () => {
            await updateGoalReq(id, data);
            await fetchGoals();
        });

    const remove = (id: number) =>
        attempt(async () => {
            await deleteGoalReq(id);
            await fetchGoals();
        });

    return (
        <GoalContext.Provider value={{ goals, loading, getAll, create, update, remove }}>
            {children}
        </GoalContext.Provider>
    );
}
