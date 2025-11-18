import { forwardRef } from 'react';
import styles from './NumberInput.module.css';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, error, suffix, className = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={props.id} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type="number"
            inputMode="decimal"
            className={`${styles.input} ${error ? styles.error : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>
        {error && (
          <span id={`${props.id}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
