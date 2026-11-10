/** Fecha local como `YYYY-MM-DD`, el formato de fechas de la API. */
export function toDateOnly(date: Date): string {
    return date.toLocaleDateString('sv-SE');
}

/** `YYYY-MM-DD` → Date a la medianoche local (sin corrimiento por zona horaria). */
export function fromDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/** "2 nov" a partir de un Date o de un `YYYY-MM-DD`. */
export function formatDay(value: Date | string): string {
    const date = typeof value === 'string' ? fromDateOnly(value) : value;
    return `${date.getDate()} ${date.toLocaleString('es-AR', { month: 'short' })}`;
}
