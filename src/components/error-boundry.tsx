import React, { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Button } from '@components/button';
import { router } from 'next/client';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends React.Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren) {
    super(props);

    // Define a state variable to track whether there is an error or not
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      message: error.message ?? 'Something went wrong.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render(): ReactNode {
    // Check if an error is thrown
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <div
          className={'flex h-[80%] flex-col items-center justify-center gap-4'}
        >
          <h1 className={'font-semibold'}>{this.state.message}</h1>
          <div className={'flex flex-row  gap-4'}>
            <Button variant={'default'} onClick={() => router.back()}>
              Go back
            </Button>
            <Button
              variant={'default'}
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </Button>
          </div>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
