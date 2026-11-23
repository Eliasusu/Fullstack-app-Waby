/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { CreateMesocycleInput, Mesocycle, UpdateMesocycleInput } from "@waby/shared";
import { createMesocycleReq, deleteMesocycleReq, getMesocyclesReq, updateMesocycleReq } from "@/mesocycles/mesocycle.api.ts";
import { useResetOnUserChange } from "@/users/auth.context.tsx";
import { useLoader } from "@/lib/load.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface MesocycleState {
    /** Mesociclos del usuario de la sesión. */
    mesocycles: Mesocycle[];
    loading: boolean;
    getMesocycles: () => Promise<void>;
    create: (data: CreateMesocycleInput) => Promise<Result<Mesocycle>>;
    update: (id: number, data: UpdateMesocycleInput) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['MesocycleProvider no está montado'] });

export const MesocycleContext = createContext<MesocycleState>({
    mesocycles: [],
    loading: false,
    getMesocycles: async () => { },
    create: notReady,
    update: notReady,
    remove: notReady,
});

export const useMesocycles = () => useContext(MesocycleContext);

/** Mesociclos (nota 78). Mismo patrón que los demás contextos: cargas seguras y acciones con Result. */
export const MesocycleProvider = ({ children }: { children: ReactNode }) => {
    const [mesocycles, setMesocycles] = useState<Mesocycle[]>([]);
    // Son datos del usuario: se vacían al cambiar de sesión (nota 53).
    useResetOnUserChange(() => setMesocycles([]));
    const { loading, run } = useLoader();

    const fetchMesocycles = async () => {
        const res = await getMesocyclesReq();
        setMesocycles(res.data);
    };

    /** Si la carga falla avisa con un toast (nota 63). */
    const getMesocycles = async () => {
        await run(fetchMesocycles);
    };

    const create = (data: CreateMesocycleInput) =>
        attempt(async () => {
            const res = await createMesocycleReq(data);
            await fetchMesocycles();
            return res.data;
        });

    const update = (id: number, data: UpdateMesocycleInput) =>
        attempt(async () => {
            await updateMesocycleReq(id, data);
            await fetchMesocycles();
        });

    const remove = (id: number) =>
        attempt(async () => {
            await deleteMesocycleReq(id);
            await fetchMesocycles();
        });

    return (
        <MesocycleContext.Provider value={{ mesocycles, loading, getMesocycles, create, update, remove }}>
            {children}
        </MesocycleContext.Provider>
    );
};
