import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("🚨 Global Error Boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    // Clear local cache and reload
    localStorage.clear();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 p-6 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl">
             ⚠️
          </div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2 uppercase tracking-tight">
            Something went wrong
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
            The application encountered an unexpected error. This usually happens after a new update.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            Recover & Refresh
          </button>
          <p className="mt-6 text-xs text-gray-400 uppercase font-bold tracking-widest">
            AgriSat Production Guard
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
