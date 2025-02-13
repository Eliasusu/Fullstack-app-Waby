import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const errorMessages: Record<number, string> = {
    404: 'Página no encontrada, volvete a tu cueva',
    500: 'Error interno del servidor, exploto todo',
    403: 'Acceso denegado, vola loquitaaa',
};

interface ErrorPageProps {
    code?: number;
    redirectOnClientError?: boolean;
}

const ErrorPage = ({ code, redirectOnClientError = false }: ErrorPageProps) => {
    const params = useParams();
    const navigate = useNavigate();
    
    const errorCode = code || Number(params.code);

    useEffect(() => {
        // Si es un error 4xx (cliente) y redirectOnClientError es true
        if (redirectOnClientError && errorCode >= 400 && errorCode < 500) {
            // Regresar a la página anterior
            navigate(-1);
        }
    }, [errorCode, redirectOnClientError, navigate]);

    // Si es un error 4xx y redirectOnClientError es true, no renderizar nada
    // mientras se procesa la redirección
    if (redirectOnClientError && errorCode >= 400 && errorCode < 500) {
        return null;
    }

    const errorMessage = errorMessages[errorCode] || 'Ocurrió un error inesperado';

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-500">{errorCode}</h1>
            <p className="text-xl mt-4">{errorMessage}</p>
        </div>
    );
};

export default ErrorPage;
