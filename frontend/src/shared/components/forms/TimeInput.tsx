import { forwardRef } from 'react';
import styles from './TimeInput.module.css';

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={props.id} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="time"
          className={`${styles.input} ${error ? styles.error : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${props.id}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';
