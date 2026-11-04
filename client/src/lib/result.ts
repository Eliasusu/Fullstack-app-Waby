import { getErrorMessages } from "./api-error";

/** Resultado de una acción contra la API: la pantalla decide qué mostrar sin leer estado viejo. */
export type Result<T = void> = { ok: true; data: T } | { ok: false; errors: string[] };

export async function attempt<T>(action: () => Promise<T>): Promise<Result<T>> {
    try {
        return { ok: true, data: await action() };
    } catch (error) {
        return { ok: false, errors: getErrorMessages(error) };
    }
}
