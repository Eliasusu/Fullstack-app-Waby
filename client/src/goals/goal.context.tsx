/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { CreateGoalInput, Goal, UpdateGoalInput } from "@waby/shared";
import { createGoalReq, deleteGoalReq, getGoalsReq, updateGoalReq } from "@/goals/goal.api.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface GoalState {
    goals: Goal[];
    getAll: () => Promise<void>;
    create: (data: CreateGoalInput) => Promise<Result>;
    update: (id: number, data: UpdateGoalInput) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['GoalProvider no está montado'] });

export const GoalContext = createContext<GoalState>({
    goals: [],
    getAll: async () => { },
    create: notReady,
    update: notReady,
    remove: notReady,
});

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<Goal[]>([]);

    const getAll = async () => {
        const res = await getGoalsReq();
        setGoals(res.data);
    };

    const create = (data: CreateGoalInput) =>
        attempt(async () => {
            await createGoalReq(data);
            await getAll();
        });

    const update = (id: number, data: UpdateGoalInput) =>
        attempt(async () => {
            await updateGoalReq(id, data);
            await getAll();
        });

    const remove = (id: number) =>
        attempt(async () => {
            await deleteGoalReq(id);
            await getAll();
        });

    return (
        <GoalContext.Provider value={{ goals, getAll, create, update, remove }}>
            {children}
        </GoalContext.Provider>
    );
}
