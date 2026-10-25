import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 border border-red-200 max-w-md w-full shadow-lg">
            <div className="text-5xl mb-4 text-center">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3 text-center">Something went wrong</h1>
            <p className="text-slate-600 mb-4 text-center">{this.state.error?.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
