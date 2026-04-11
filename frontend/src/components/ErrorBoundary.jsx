import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Global Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    return (
      <div>
        {this.state.hasError ? null : this.props.children}
      </div>
    );
  }
}

export default ErrorBoundary;
