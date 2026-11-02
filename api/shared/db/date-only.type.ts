import { Type } from '@mikro-orm/core';

/**
 * Fecha sin hora guardada como `DATE` y expuesta como string `YYYY-MM-DD`.
 * El `DateType` de MikroORM la convierte a `Date`, y ahí aparecen los corrimientos
 * por zona horaria (nota 62).
 */
export class DateOnlyType extends Type<string | null | undefined, string | null | undefined> {
    convertToDatabaseValue(value: string | null | undefined) {
        return value;
    }

    convertToJSValue(value: unknown) {
        if (value == null) return value as null | undefined;
        // mysql2 arma el Date a la medianoche local de esa fecha: se formatea en hora local.
        if (value instanceof Date) return value.toLocaleDateString('sv-SE');
        return String(value).slice(0, 10);
    }

    compareAsType() {
        return 'string';
    }

    getColumnType() {
        return 'date';
    }
}
