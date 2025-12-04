import React, { Component, ErrorInfo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { captureException } from "@/lib/sentry";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional fallback UI to render on error */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, eventId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Send error to Sentry with component stack
    const eventId = captureException(error, {
      tags: { type: "react_error_boundary" },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    this.setState({ eventId: eventId || null });

    // Also log to console for debugging
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
              aria-hidden="true"
            />

            <h1 className="text-xl font-semibold mb-2">
              Ocorreu um erro inesperado
            </h1>
            <p className="text-muted-foreground mb-4 text-center">
              Desculpe pelo inconveniente. Nossa equipe foi notificada.
            </p>

            <div className="p-4 w-full rounded bg-muted overflow-auto mb-6">
              <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                {this.state.error?.message || "Erro desconhecido"}
              </pre>
            </div>

            {this.state.eventId && (
              <p className="text-xs text-muted-foreground mb-4">
                ID do erro: {this.state.eventId}
              </p>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
