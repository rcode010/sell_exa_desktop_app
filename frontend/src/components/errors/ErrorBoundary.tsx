import { OctagonAlert } from "lucide-react";
import React, { Component, ReactNode } from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

// Global error boundary to catch JavaScript errors in the component tree
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Static method to get the derived state from error
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Logs error to console or external service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "ErrorBoundary caught an error: ",
      error,
      +"\n" + "Error info: " + errorInfo
    );
  }

  render() {
    // If an error occurred
    if (this.state.hasError) {
      // If a fallback is provided display it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-600 text-5xl mb-4">
              <OctagonAlert size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>

            <button
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // If no error occurred, render children components (App.tsx)
    return this.props.children;
  }
}

export default ErrorBoundary;
