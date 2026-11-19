import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorPage from "@/pages/Errors/ErrorPage.tsx";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Red de seguridad para errores de render (nota 82): en vez de dejar la app en blanco,
 * muestra la página de error con una forma de volver. React solo permite atrapar estos
 * errores con un componente de clase. En App se monta con `key` = ruta, así que al navegar
 * a otra pantalla se reinicia.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Error de render', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) return <ErrorPage code={500} />;
        return this.props.children;
    }
}
