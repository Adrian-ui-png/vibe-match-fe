import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error trapped in UI:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4 text-center">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-brand-pink/30 space-y-4 shadow-2xl">
            <div className="inline-flex p-3 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-lg font-black text-white">Oops, something went wrong!</h1>
            <p className="text-xs text-gray-400 leading-normal">
              A temporary layout error was caught. Tap below to reload the Compatibility Calculator and retry.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer shadow-lg border border-white/10 hover:brightness-110 active:scale-95 transition-all"
            >
              Reload Quiz 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
