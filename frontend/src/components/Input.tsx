import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const Input: React.FC<InputProps> = ({ id, label, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <input
        id={id}
        className={styles.input}
        placeholder=" " // This space is crucial for the floating label effect
        {...props}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
};
