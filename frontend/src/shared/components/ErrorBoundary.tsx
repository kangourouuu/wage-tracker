import { Component } from 'react';
import type { ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorFallback}>
          <div className={styles.content}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Oops! Something went wrong</h2>
            <p className={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button className={styles.button} onClick={this.handleReload}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
