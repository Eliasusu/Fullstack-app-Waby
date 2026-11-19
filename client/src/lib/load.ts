import { useCallback, useState } from "react";
import { getErrorMessages } from "./api-error";
import { notifyErrors } from "./notify";

/**
 * Cargas de datos de un contexto (listados, entrenamiento del día).
 *
 * - Si la carga falla, avisa con un toast en lugar de dejar una promesa rechazada sin manejar (nota 63).
 * - `loading` es true mientras haya alguna carga en curso, para que las pantallas muestren
 *   "Cargando…" en vez de "No hay datos" (nota 82). Se cuentan las cargas para que dos en paralelo
 *   no apaguen el indicador antes de tiempo.
 */
export function useLoader() {
    const [pending, setPending] = useState(0);

    const run = useCallback(async (load: () => Promise<unknown>): Promise<boolean> => {
        setPending((count) => count + 1);
        try {
            await load();
            return true;
        } catch (error) {
            notifyErrors(getErrorMessages(error));
            return false;
        } finally {
            setPending((count) => count - 1);
        }
    }, []);

    return { loading: pending > 0, run };
}
