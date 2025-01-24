import { useNavigate } from 'react-router-dom';

const useErrorHandler = () => {
    const navigate = useNavigate();

    const handleError = (error: { code: number; message?: string }) => {
        navigate(`/error/${error.code}`, { state: { message: error.message } });
    };

    return handleError;
};

export default useErrorHandler;
