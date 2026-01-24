/**
 * ERROR BOUNDARY: Graceful Crash Handler
 * 
 * Catches React component errors and displays a calming recovery screen
 * instead of a blank page. Essential for production stability.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home, Heart } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        // Log to console (in production, send to observability service)
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

        // TODO: Send to observability service
        // observability.logError(error, errorInfo);
    }

    handleRefresh = (): void => {
        window.location.reload();
    };

    handleGoHome = (): void => {
        window.location.href = '/';
    };

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="min-h-screen flex items-center justify-center p-6"
                    style={{
                        background: 'linear-gradient(135deg, #FAF7F5 0%, #F5F0EB 100%)',
                    }}
                >
                    <div className="max-w-md w-full text-center">
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-[#4B0082]" />
                        </div>

                        {/* Message */}
                        <h1
                            className="text-2xl mb-3"
                            style={{ fontFamily: 'var(--font-display)', color: '#1A1A1A' }}
                        >
                            The Sanctuary Needs a Moment
                        </h1>
                        <p className="text-sm opacity-70 mb-6">
                            Something unexpected happened. Your data is safe, and we're ready to continue when you are.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleRefresh}
                                className="w-full py-3 px-4 rounded-xl bg-[#4B0082] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#6B238E] transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh & Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full py-3 px-4 rounded-xl bg-white/60 border border-[#4B0082]/20 font-semibold flex items-center justify-center gap-2 hover:bg-white/80 transition-colors"
                                style={{ color: '#1A1A1A' }}
                            >
                                <Home className="w-4 h-4" />
                                Return to Sanctuary
                            </button>
                        </div>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left p-4 rounded-xl bg-red-50 border border-red-200">
                                <summary className="flex items-center gap-2 text-sm font-semibold text-red-700 cursor-pointer">
                                    <AlertCircle className="w-4 h-4" />
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Support Link */}
                        <p className="text-xs opacity-50 mt-8">
                            If this keeps happening, please reach out to support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
