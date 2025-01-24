import { useParams } from 'react-router-dom';

const errorMessages: Record<number, string> = {
    404: 'Página no encontrada, volvete a tu cueva',
    400: 'Solicitud incorrecta, escribí bien, HDP',
    500: 'Error interno del servidor, exploto todo',
    403: 'Acceso denegado, vola loquitaaa',
};

const ErrorPage = ({ code, message }: { code?: number, message?: string }) => {
    const params = useParams<{ code: string }>();
    const errorCode = code || parseInt(params.code || '404', 10);
    const errorMessage = message || errorMessages[errorCode] || 'Ocurrió un error inesperado';

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-500">{errorCode}</h1>
            <p className="text-xl mt-4">{errorMessage}</p>
        </div>
    );
};

export default ErrorPage;
