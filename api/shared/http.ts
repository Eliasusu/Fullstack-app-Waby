import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForeignKeyConstraintViolationException, NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ZodError, type ZodIssue, type ZodTypeAny, type z } from 'zod';
import { IdParamSchema } from '@waby/shared';

/** Error con código HTTP. Lo traduce el manejador global. */
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export const notFound = (message = 'No encontrado') => new HttpError(404, message);
export const conflict = (message: string) => new HttpError(409, message);

/** Error de validación armado a mano, con la misma forma que los de Zod. */
export class ValidationFailed extends Error {
    constructor(public issues: Pick<ZodIssue, 'path' | 'message'>[]) {
        super('Datos inválidos');
    }
}

export const invalid = (field: string, message: string) => new ValidationFailed([{ path: [field], message }]);

/** Express 4 no captura errores de handlers async: este wrapper los manda al manejador global. */
export const asyncHandler =
    (handler: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
    (req, res, next) => {
        handler(req, res).catch(next);
    };

export function parse<S extends ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
    return schema.parse(data);
}

/** Id de un parámetro de ruta. Si no es un entero positivo responde 400. */
export function idParam(req: Request, name = 'id'): number {
    const result = IdParamSchema.safeParse(req.params[name]);
    if (!result.success) throw invalid(name, 'El id tiene que ser un entero positivo');
    return result.data;
}

/** Manejador global de errores (nota 25). Nunca expone detalles internos. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Datos inválidos',
            issues: err.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        });
    }
    if (err instanceof ValidationFailed) {
        return res.status(400).json({ message: err.message, issues: err.issues });
    }
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ message: 'El body no es JSON válido', issues: [] });
    }
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: 'No encontrado' });
    }
    if (err instanceof UniqueConstraintViolationException) {
        return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
    }
    if (err instanceof ForeignKeyConstraintViolationException) {
        return res.status(409).json({ message: 'El registro está en uso' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Error interno del servidor' });
}
