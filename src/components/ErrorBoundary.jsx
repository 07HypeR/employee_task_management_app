import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-red-500 font-bold mb-4">
            Something went wrong.
          </h1>
          <pre className="bg-black p-4 rounded text-red-300 overflow-auto max-w-full">
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre className="mt-4 text-xs text-gray-500">
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mt-8 px-6 py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            Clear Cache & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
