import { isAxiosError } from "axios";

/**
 * Mensajes legibles de un error de la API. Los 400 traen `issues` (ValidationError de
 * @waby/shared); el resto, `{ message }`.
 */
export function getErrorMessages(error: unknown): string[] {
    if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string; issues?: { path: (string | number)[]; message: string }[] } | undefined;
        if (data?.issues?.length) {
            return data.issues.map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message));
        }
        if (data?.message) return [data.message];
        if (!error.response) return ['No se pudo conectar con el servidor'];
    }
    return ['Ocurrió un error inesperado'];
}
