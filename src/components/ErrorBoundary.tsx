import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Root error boundary to prevent blank screens on uncaught render errors.
 * Shows a fallback UI with reload option instead of leaving the viewport blank.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background p-8"
          data-testid="error-boundary-fallback"
        >
          <h1 className="text-xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <Button onClick={this.handleReload} variant="default">
            Reload page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
