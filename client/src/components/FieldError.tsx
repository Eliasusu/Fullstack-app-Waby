/** Mensaje de error debajo de un campo de formulario (nota 66). */
export default function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p role="alert" className="text-red text-xs mt-1">
            {message}
        </p>
    );
}
