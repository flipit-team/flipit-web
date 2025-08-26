'use client';
import React from 'react';
import Error from './error';

interface Props {
    children: React.ReactNode; // Child components to wrap
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state to show the fallback UI
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log the error (you can also send it to an error reporting service)
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            // Render your custom fallback UI here
            return <Error />;
        }
        // Return children components in case of no error
        return this.props.children;
    }
}

export default ErrorBoundary;
