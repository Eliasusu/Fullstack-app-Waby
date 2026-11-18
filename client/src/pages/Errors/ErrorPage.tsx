import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/users/auth.context.tsx';

const errorMessages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'No tenés permiso para ver esta página',
        description: 'Esta sección es solo para administradores.',
    },
    404: {
        title: 'Página no encontrada',
        description: 'La dirección no existe o se movió.',
    },
    500: {
        title: 'Algo salió mal',
        description: 'Ocurrió un error inesperado al mostrar esta pantalla. Probá volver al inicio.',
    },
};

interface ErrorPageProps {
    code?: number;
}

/** Página de error con un mensaje que se entiende y una forma de volver (nota 82). */
const ErrorPage = ({ code }: ErrorPageProps) => {
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const errorCode = code ?? (Number(params.code) || 500);
    const { title, description } = errorMessages[errorCode] ?? errorMessages[500];

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
            <p className="text-5xl font-bold text-red">{errorCode}</p>
            <h1 className="text-xl font-semibold text-white-text">{title}</h1>
            <p className="text-sm text-white-text/70 max-w-sm">{description}</p>
            <Link
                to={isAuthenticated ? '/home' : '/'}
                className="mt-2 rounded-xl bg-red px-4 py-2 font-bold hover:bg-redHover transition"
            >
                {isAuthenticated ? 'Volver al inicio' : 'Ir a la página principal'}
            </Link>
        </main>
    );
};

export default ErrorPage;
