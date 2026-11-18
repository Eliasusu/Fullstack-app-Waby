import type { ZodIssue, ZodTypeAny, z } from "zod";

/** Errores de un formulario por campo: `{ name: 'Este campo es obligatorio' }`. */
export type FieldErrors = Record<string, string>;

export type Validation<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

/**
 * Valida con un esquema de @waby/shared antes de llamar a la API (nota 66): el client
 * valida lo mismo que la API y el error se muestra junto al campo, sin ir al servidor.
 * La clave de cada error es el primer tramo del path (`muscleGroupIds`, `reps`...).
 */
export function validate<S extends ZodTypeAny>(schema: S, data: unknown): Validation<z.infer<S>> {
    const result = schema.safeParse(data);
    if (result.success) return { ok: true, data: result.data };
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? 'form');
        errors[field] ??= messageFor(issue);
    }
    return { ok: false, errors };
}

/** Mensajes para un toast, con el nombre del campo: "Nombre: Este campo es obligatorio". */
export function errorList(errors: FieldErrors, labels: Record<string, string> = {}): string[] {
    return Object.entries(errors).map(([field, message]) => (labels[field] ? `${labels[field]}: ${message}` : message));
}

/** Los mensajes por defecto de Zod empiezan así; los propios de los esquemas, no. */
const DEFAULT_PREFIXES = ['Required', 'Expected', 'String must', 'Number must', 'Array must', 'Invalid'];

/** Traduce los mensajes por defecto de Zod y respeta los que definen los esquemas de @waby/shared. */
function messageFor(issue: ZodIssue): string {
    if (!DEFAULT_PREFIXES.some((prefix) => issue.message.startsWith(prefix))) return issue.message;
    switch (issue.code) {
        case 'invalid_type':
            if (issue.received === 'undefined' || issue.received === 'null') return 'Este campo es obligatorio';
            if (issue.received === 'nan') return 'Tiene que ser un número';
            if (issue.expected === 'integer') return 'Tiene que ser un número entero';
            return 'El valor no es válido';
        case 'too_small':
            if (issue.type === 'string') return issue.minimum === 1 ? 'Este campo es obligatorio' : `Tiene que tener al menos ${issue.minimum} caracteres`;
            if (issue.type === 'array') return 'Elegí al menos una opción';
            return issue.inclusive ? `Tiene que ser ${issue.minimum} o más` : `Tiene que ser mayor que ${issue.minimum}`;
        case 'too_big':
            if (issue.type === 'string') return `Puede tener hasta ${issue.maximum} caracteres`;
            return `Tiene que ser ${issue.maximum} o menos`;
        case 'invalid_enum_value':
            return 'Elegí una opción';
        case 'invalid_string':
            return issue.validation === 'email' ? 'El email no es válido' : 'El formato no es válido';
        default:
            return 'El valor no es válido';
    }
}

/** '' → undefined, así un campo numérico vacío da "obligatorio" y no 0 (nota 66: antes se mandaba NaN o 0). */
export const numberOrUndefined = (value: string) => (value.trim() === '' ? undefined : Number(value));
