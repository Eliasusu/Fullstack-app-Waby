import { toast } from "@/hooks/use-toast.ts";
import type { Result } from "./result";

/** Muestra el resultado de una acción: el éxito solo si la API respondió OK (nota 69). */
export function notifyResult(result: Result<unknown>, success: { title: string; description?: string }): boolean {
    if (result.ok) {
        toast({ title: success.title, description: success.description });
        return true;
    }
    notifyErrors(result.errors);
    return false;
}

export function notifyErrors(errors: string[]) {
    toast({
        title: errors.length > 1 ? 'Hay errores en los datos' : 'No se pudo completar la acción',
        description: errors.join('\n'),
        variant: 'destructive',
    });
}
